import { test, expect } from '@playwright/test';
import owners from '../test-data/owners.json'
import owner2515 from '../test-data/owner2515.json'
import specialties from '../test-data/specialties.json'


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

test('Intercept API response', async ({ page }) => {

    await page.route('**/api/vets', async route => {

        const response = await route.fetch()
        const responseBody = await response.json()

        responseBody[5].specialties = specialties

        await route.fulfill({
            body: JSON.stringify(responseBody)
        })
    })

    const responsePromise = page.waitForResponse(
        res => res.url().includes('/api/vets')
    );

    await page.getByRole("button", { name: "Veterinarians" }).click()
    await page.getByRole("link", { name: "All" }).click()

    await responsePromise;

    for (let specialty of specialties){
        await expect(page.getByRole("row", {name: "Sharon Jenkins"}).locator('td').nth(1)).toContainText(specialty.name)
    }
})

