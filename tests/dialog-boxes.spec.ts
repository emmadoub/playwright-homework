import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})


test("Add and delete pet type", async ({ page }) => {

    await page.getByRole('link', { name: "Pet Types" }).click()

    await expect(page.getByRole('heading')).toHaveText("Pet Types")

    await page.getByRole('button', {name: "Add"}).click()
    await expect(page.getByRole('heading', {name: "New Pet Type"})).toBeVisible()
    await expect(page.locator('label', {hasText: "Name"})).toBeVisible()
    const newPetTypeNameInput =  page.locator('input#name')
    await expect(newPetTypeNameInput).toBeVisible() 
    await newPetTypeNameInput.fill("pig")
    await page.getByRole('button', {name: "Save"}).click()

    const petTypeListLastItemValue = page.locator('table td input').last()
    await expect(petTypeListLastItemValue).toHaveValue('pig')
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Delete the pet type?')
        dialog.accept()
    })
    await page.getByRole('row', {name: "pig"}).getByRole('button', {name: "Delete"}).click()
    await expect(petTypeListLastItemValue).not.toHaveValue('pig')

});