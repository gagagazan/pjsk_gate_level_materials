import { test, expect, type Locator } from '@playwright/test'

// Resolve modern CSS colors (including OKLCH) through the browser, then composite
// translucent surfaces over their ancestors before checking text contrast.
async function expectReadable(locator: Locator) {
  await expect(locator).toBeVisible()
  // Sample the settled hover/selection state rather than an intermediate CSS transition.
  await expect.poll(async () => locator.evaluate(element => {
    const context = document.createElement('canvas').getContext('2d')!
    context.canvas.width = context.canvas.height = 1
    function rgba(color: string) {
      context.clearRect(0, 0, 1, 1)
      context.fillStyle = color
      context.fillRect(0, 0, 1, 1)
      return Array.from(context.getImageData(0, 0, 1, 1).data)
    }
    function over(front: number[], back: number[]) {
      const alpha = front[3] / 255
      return front.slice(0, 3).map((channel, i) => channel * alpha + back[i] * (1 - alpha))
    }
    const ancestors: Element[] = []
    for (let node: Element | null = element; node; node = node.parentElement) ancestors.unshift(node)
    let background = [255, 255, 255]
    for (const node of ancestors) background = over(rgba(getComputedStyle(node).backgroundColor), background)
    const foreground = over(rgba(getComputedStyle(element).color), background)
    function luminance(rgb: number[]) {
      return rgb.map(channel => {
        const value = channel / 255
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
      }).reduce((sum, channel, i) => sum + channel * [0.2126, 0.7152, 0.0722][i], 0)
    }
    const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
    return (values[0] + 0.05) / (values[1] + 0.05)
  }), { message: `Text contrast for ${await locator.textContent()}` }).toBeGreaterThanOrEqual(4.5)
}

for (const theme of ['light', 'dark'] as const) {
  test(`${theme}: readable surfaces, controls, and responsive navigation`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.emulateMedia({ colorScheme: theme })
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(new RegExp(theme))
    const navigation = page.getByRole('navigation', { name: '分区导航' })
    await expectReadable(page.getByRole('heading', { level: 1 }))
    await expectReadable(page.getByTestId('gaps-heading'))
    const surfaces = await page.locator('header, aside, #overview-ln').evaluateAll(elements =>
      elements.map(element => {
        const context = document.createElement('canvas').getContext('2d')!
        context.fillStyle = getComputedStyle(element).backgroundColor
        context.fillRect(0, 0, 1, 1)
        return context.getImageData(0, 0, 1, 1).data[0]
      }))
    for (const brightness of surfaces) {
      if (theme === 'dark') expect(brightness).toBeLessThan(80)
      else expect(brightness).toBeGreaterThan(240)
    }

    const inventoryButton = navigation.getByRole('button', { name: '库存' })
    // Keyboard focus and hover remain visible in both themes.
    await inventoryButton.focus()
    await expect(inventoryButton).toBeFocused()
    await expect(inventoryButton).not.toHaveCSS('box-shadow', 'none')
    await inventoryButton.hover()
    await expectReadable(inventoryButton)
    await inventoryButton.click()
    await expect(inventoryButton).toHaveAttribute('aria-current', 'page')
    await expectReadable(inventoryButton)
    const icon = page.locator('img[data-testid="material-icon-slot"]').first()
    await expect(icon).toHaveCSS('filter', theme === 'dark' ? 'brightness(0.85) saturate(0.85)' : 'none')
    await expectReadable(page.getByTestId('inventory-heading'))
    await expectReadable(page.getByRole('heading', { name: '基础材料' }))
    const wood = page.getByLabel('心愿木材', { exact: true })
    await expectReadable(page.locator('label[for="inv-wish-wood"]'))
    await wood.fill('3')
    await wood.press('d')
    await expect(page.locator('html')).toHaveClass(new RegExp(theme))
    await wood.fill('3')
    await page.getByLabel('心愿石块', { exact: true }).fill('999')
    await page.keyboard.press('Tab')
    await navigation.getByRole('button', { name: '材料缺口' }).click()

    const card = page.locator('#overview-ln')
    await expect(card.locator('img').first()).toHaveCSS('filter', 'none')
    await expectReadable(card.locator('.unit-heading'))
    await expectReadable(card.getByText('目标等级', { exact: true }))
    const slider = card.getByRole('slider').nth(1)
    await slider.focus()
    await slider.press('ArrowRight')
    await expect(card.getByText('Lv.1 → Lv.2')).toBeVisible()
    await expectReadable(card.getByText('2', { exact: true }))
    const rows = page.getByTestId('section-gaps').locator('.divide-y > div')
    await expectReadable(rows.getByText('心愿木材', { exact: true }))
    await expectReadable(rows.getByText('3 / 5', { exact: true }))
    await expectReadable(rows.getByText('缺 2', { exact: true }).first())
    await expectReadable(rows.getByText('充足', { exact: true }).first())
    await expect(card.getByTestId('level-down-ln')).toBeDisabled()
    await page.getByRole('tab', { name: 'Leo/need' }).click()
    const detail = page.getByTestId('unit-detail-panel')
    await detail.getByText('查看每级明细').click()
    await expectReadable(detail.getByText('Lv.1 → Lv.2', { exact: true }).last())

    // The page must fit the viewport; only the intended tab strip may scroll.
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    await page.getByRole('tab', { name: '25点，Nightcord见。' }).click()
    await expect(page.getByTestId('unit-detail-panel').getByText('25点，Nightcord见。')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    expect(errors).toEqual([])
  })
}

test('D switches themes, persists after reload, and follows system until overridden', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/light/)
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.keyboard.press('d')
  await expect(page.locator('html')).toHaveClass(/light/)
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/light/)
  await page.keyboard.press('d')
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expectReadable(page.getByRole('heading', { level: 1 }))
})
