import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('page loads with title and unit cards', async ({ page }) => {
  await expect(page).toHaveTitle(/PJSK/)
  await expect(page.locator('#overview-ln').getByText('Leo/need')).toBeVisible()
  await expect(page.locator('#overview-25').getByText('25点，Nightcord见。')).toBeVisible()
})

test('slider adjusts target level', async ({ page }) => {
  const card = page.locator('#overview-ln')
  await expect(card.getByText('Lv.1 → Lv.1')).toBeVisible()
  const sliders = card.locator('[role="slider"]')
  await sliders.nth(1).click()
  await page.keyboard.press('ArrowRight')
  await expect(card.getByText('Lv.1 → Lv.2')).toBeVisible()
})

test('inventory input updates dashboard', async ({ page }) => {
  // Set Leo/need target to level 2 so wish-wood appears in dashboard
  const card = page.locator('#overview-ln')
  const sliders = card.locator('[role="slider"]')
  await sliders.nth(1).click()
  await page.keyboard.press('ArrowRight')
  await expect(card.getByText('Lv.1 → Lv.2')).toBeVisible()

  await page.getByLabel('心愿木材').fill('3')
  await page.keyboard.press('Enter')
  await expect(page.getByText('3 /').first()).toBeVisible()
})

test('export and import round-trip', async ({ page }) => {
  await page.getByLabel('心愿木材').fill('42')

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: '导出' }).click(),
  ])
  const path = await download.path()
  expect(path).toBeTruthy()

  const fs = await import('fs')
  const exported = fs.readFileSync(path!, 'utf-8')
  const parsed = JSON.parse(exported)
  expect(parsed.inventory['wish-wood']).toBe(42)

  // Reset state
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await expect(page.getByLabel('心愿木材')).toHaveValue('0')

  // Import the exported file
  await page.getByRole('button', { name: '导入' }).click()
  await page.locator('input[type="file"]').setInputFiles(path!)

  await expect(page.getByLabel('心愿木材')).toHaveValue('42')
})
