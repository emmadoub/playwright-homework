import { test, expect } from "@playwright/test";
import { faker } from '@faker-js/faker'

test("visual testing", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("button", { name: "Owners" }).click()
    await page.getByRole("link", { name: "Add New" }).click()
    const addOwnerButton = page.getByRole('button', {name: "Add Owner"})
    await expect(addOwnerButton).toHaveScreenshot()
    await page.getByRole('textbox', { name: "First Name" }).fill(faker.person.firstName())
    await page.getByRole('textbox', { name: "Last Name" }).fill(faker.person.lastName())
    await page.getByRole('textbox', { name: "Address" }).fill(faker.location.streetAddress())
    await page.getByRole('textbox', { name: "City" }).fill(faker.location.city())
    await page.getByRole('textbox', { name: "Telephone" }).fill(`608555${faker.string.numeric(4)}`)
    await expect(addOwnerButton).toHaveScreenshot()
});