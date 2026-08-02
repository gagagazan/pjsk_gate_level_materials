import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('page loads with title and default gaps section', async ({ page }) => {
  await expect(page).toHaveTitle(/PJSK/)
  await expect(page.getByTestId('section-gaps')).toBeVisible()
  await expect(page.getByTestId('gaps-heading')).toBeVisible()
  // Global overview cards live inside the gaps section now
  await expect(page.locator('#overview-ln').getByText('Leo/need')).toBeVisible()
  await expect(page.locator('#overview-25').getByText('25点，Nightcord见。')).toBeVisible()
})

test('slider adjusts target level from global gap tab', async ({ page }) => {
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

  await page.getByRole('navigation').getByRole('button', { name: '材料缺口' }).click()
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
  test('stays below the app bar while the page scrolls', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    const rail = page.getByTestId('section-rail')
    const topBeforeScroll = await rail.evaluate(element => element.getBoundingClientRect().top)

    await page.evaluate(() => window.scrollTo(0, 200))

    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
    expect(await rail.evaluate(element => element.getBoundingClientRect().top)).toBe(topBeforeScroll)
  })

  test('shows only gaps and inventory, defaulting to gaps', async ({ page }) => {
    await expect(page.getByRole('navigation').getByRole('button', { name: '材料缺口' })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('button', { name: '库存' })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('button', { name: '概览' })).toHaveCount(0)
    await expect(page.getByRole('navigation').getByRole('button', { name: '各团' })).toHaveCount(0)
    // Exactly two rail buttons remain
    await expect(page.getByRole('navigation').getByRole('button')).toHaveCount(2)
    await expect(page.getByTestId('section-gaps')).toBeVisible()
  })

  test('switching to inventory hides gaps and shows inventory panel', async ({ page }) => {
    await page.getByRole('navigation').getByRole('button', { name: '库存' }).click()
    await expect(page.getByTestId('section-inventory')).toBeVisible()
    await expect(page.getByTestId('section-gaps')).not.toBeVisible()
    await expect(page.getByTestId('inventory-heading')).toBeVisible()
  })

  test('switching back to gaps shows material gap summary', async ({ page }) => {
    await page.getByRole('navigation').getByRole('button', { name: '库存' }).click()
    await page.getByRole('navigation').getByRole('button', { name: '材料缺口' }).click()
    await expect(page.getByTestId('section-gaps')).toBeVisible()
    await expect(page.getByTestId('gaps-heading')).toBeVisible()
  })
})

test.describe('inventory grouping', () => {
  test('renders memory and basic sections', async ({ page }) => {
    await page.getByRole('navigation').getByRole('button', { name: '库存' }).click()
    await expect(page.getByText('记忆材料').first()).toBeVisible()
    await expect(page.getByText('基础材料').first()).toBeVisible()
  })

  test('memory material list is continuous', async ({ page }) => {
    await page.getByRole('navigation').getByRole('button', { name: '库存' }).click()
    const section = page.getByTestId('section-inventory')
    // Expect only one memory section header
    await expect(section.locator('h3', { hasText: '记忆材料' })).toHaveCount(1)
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

    await page.getByRole('navigation').getByRole('button', { name: '材料缺口' }).click()
    const slots = page.getByTestId('section-gaps').getByTestId('material-icon-slot')
    await expect(slots.first()).toBeVisible()
    expect(await slots.count()).toBeGreaterThan(0)
  })
})

test.describe('gap tabs', () => {
  test('defaults to global tab and can switch units', async ({ page }) => {
    await expect(page.getByRole('tab', { name: '全局' })).toBeVisible()
    await page.getByRole('tab', { name: 'MORE MORE JUMP!' }).click()
    await expect(page.getByTestId('unit-detail-panel').getByText('MORE MORE JUMP!')).toBeVisible()
  })

  test('shortage rows sort by missing first then inventory order', async ({ page }) => {
    const card = page.locator('#overview-ln')
    const sliders = card.locator('[role="slider"]')
    await sliders.nth(1).click()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect(card.getByText('Lv.1 → Lv.3')).toBeVisible()

    // Make the first base material in shared order not missing.
    await page.getByRole('navigation').getByRole('button', { name: '库存' }).click()
    await page.getByLabel('心愿木材').fill('999')
    await page.getByLabel('星乃一歌的记忆').fill('0')

    // Capture the inventory page order as the source of truth.
    const inventoryNames = await page
      .getByTestId('section-inventory')
      .locator('label.text-sm.text-\\[\\#212121\\]')
      .allTextContents()

    await page.getByRole('navigation').getByRole('button', { name: '材料缺口' }).click()
    const rows = page.getByTestId('section-gaps').locator('.divide-y > div')

    // Every row before the first non-missing row must be missing.
    const names = await rows.locator('span.text-\\[\\#212121\\]').allTextContents()
    const gaps = await rows.locator('span').filter({ hasText: /^(缺 \d+|充足)$/ }).allTextContents()
    const firstSufficientIndex = gaps.findIndex(text => text === '充足')

    for (let i = 0; i < gaps.length; i++) {
      if (firstSufficientIndex === -1 || i < firstSufficientIndex) {
        expect(gaps[i]).toMatch(/^缺 \d+$/)
      }
    }

    // Order inside each bucket must match the inventory page order.
    const missingNames = firstSufficientIndex === -1 ? names : names.slice(0, firstSufficientIndex)
    const expectedMissingNames = inventoryNames.filter(name => missingNames.includes(name))
    expect(missingNames).toEqual(expectedMissingNames)
  })
})
