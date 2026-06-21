import { test, expect } from '@playwright/test';
import owners from '../test-data/owners.json'
import owner2515 from '../test-data/owner2515.json'


test.beforeEach(async ({ page }) => {
    await page.goto('/')
})



test('mocking API request', async ({ page }) => {

    await page.getByRole("button", { name: "Owners" }).click()

    await page.route('**/owners', async route => {
        await route.fulfill({
            body: JSON.stringify(owners)
        })
    })

    await page.getByRole("link", { name: "Search" }).click();

    await expect(page.locator('.ownerFullName')).toHaveCount(2)

    await page.route('**/owners/2515', async route => {
        console.log(route.request().url())

        await route.fulfill({
            body: JSON.stringify(owner2515)
        })
    });

    await page.getByRole('link', { name: 'Nick Carteris' }).click()
    await expect(page.locator('.ownerFullName')).toHaveText("Nick Carteris")

    await expect(page.locator('tr', { hasText: "Address" }).locator('td')).toHaveText("105 Acropolis St.")

    await expect(page.locator('tr', { hasText: "City" }).locator('td')).toHaveText("Athens")
    await expect(page.locator('tr', { hasText: "Telephone" }).locator('td')).toHaveText("6965543321")

    await expect(page.locator('app-pet-list')).toHaveCount(2)
    await expect(page.locator('app-pet-list').locator('dt:text-is("Name") + dd')).toHaveText(["Yuki", "Miltos"])
    await expect(page.locator('app-pet-list', { hasText: 'Yuki' }).locator('app-visit-list tr').filter({ has: page.locator('td') })).toHaveCount(10)
})


