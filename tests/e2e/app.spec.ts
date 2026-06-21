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

  await page.getByRole('navigation').getByRole('button', { name: '库存' }).click()
  await page.getByLabel('心愿木材').fill('3')
  await page.keyboard.press('Enter')

  await page.getByRole('navigation').getByRole('button', { name: '缺口' }).click()
  await expect(page.getByText('3 /').first()).toBeVisible()
})

test('export and import round-trip', async ({ page }) => {
  await page.getByRole('navigation').getByRole('button', { name: '库存' }).click()
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
  await page.getByRole('navigation').getByRole('button', { name: '库存' }).click()
  await expect(page.getByLabel('心愿木材')).toHaveValue('0')

  // Import the exported file
  await page.getByRole('button', { name: '导入' }).click()
  await page.getByTestId('import-file-input').setInputFiles(path!)

  await expect(page.getByLabel('心愿木材')).toHaveValue('42')
})

test.describe('rail navigation', () => {
  test('shows all rail items and defaults to overview', async ({ page }) => {
    await expect(page.getByRole('navigation').getByRole('button', { name: '概览' })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('button', { name: '库存' })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('button', { name: '缺口' })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('button', { name: '各团' })).toBeVisible()
    await expect(page.getByTestId('section-overview')).toBeVisible()
  })

  test('switching to inventory hides overview and shows inventory panel', async ({ page }) => {
    await page.getByRole('navigation').getByRole('button', { name: '库存' }).click()
    await expect(page.getByTestId('section-inventory')).toBeVisible()
    await expect(page.getByTestId('section-overview')).not.toBeVisible()
    await expect(page.getByTestId('inventory-heading')).toBeVisible()
  })

  test('switching to gaps shows material gap summary', async ({ page }) => {
    await page.getByRole('navigation').getByRole('button', { name: '缺口' }).click()
    await expect(page.getByTestId('section-gaps')).toBeVisible()
    await expect(page.getByTestId('gaps-heading')).toBeVisible()
  })
})

test.describe('material icon slots', () => {
  test('inventory rows have icon slots', async ({ page }) => {
    await page.getByRole('navigation').getByRole('button', { name: '库存' }).click()
    const slots = page.getByTestId('section-inventory').getByTestId('material-icon-slot')
    await expect(slots.first()).toBeVisible()
    expect(await slots.count()).toBeGreaterThan(20)
  })

  test('gap rows have icon slots', async ({ page }) => {
    // Make some gaps appear
    const card = page.locator('#overview-ln')
    const sliders = card.locator('[role="slider"]')
    await sliders.nth(1).click()
    await page.keyboard.press('ArrowRight')

    await page.getByRole('navigation').getByRole('button', { name: '缺口' }).click()
    const slots = page.getByTestId('section-gaps').getByTestId('material-icon-slot')
    await expect(slots.first()).toBeVisible()
    expect(await slots.count()).toBeGreaterThan(0)
  })
})

test.describe('unit detail tabs', () => {
  test('shows one unit at a time and switches unit title', async ({ page }) => {
    await page.getByRole('navigation').getByRole('button', { name: '各团' }).click()
    await expect(page.getByTestId('section-units')).toBeVisible()

    // Default shows first unit
    await expect(page.getByTestId('unit-detail-panel').getByText('Leo/need')).toBeVisible()

    // Switch to another unit
    await page.getByTestId('unit-detail-tabs').getByRole('tab', { name: 'MORE MORE JUMP!' }).click()
    await expect(page.getByTestId('unit-detail-panel').getByText('MORE MORE JUMP!')).toBeVisible()
    await expect(page.getByTestId('unit-detail-panel').getByText('Leo/need')).not.toBeVisible()
  })
})
