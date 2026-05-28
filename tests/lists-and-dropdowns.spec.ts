import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test('Validate selected pet types from the list', async({page}) => {
    
    await page.getByRole('button', {name: "Owners"}).click()
    await page.getByRole('link', {name: "Search"}).click()

    await expect(page.getByRole('heading')).toHaveText("Owners")
    await page.getByText("George Franklin").click()

    await expect(page.locator('.ownerFullName')).toHaveText("George Franklin")
    await page.locator('app-pet-list', {hasText: "Leo"}).getByRole('button', {name: "Edit Pet"}).click()

    await expect(page.getByRole('heading')).toHaveText("Pet")
    await expect(page.locator('.form-group', {hasText: "Owner"}).getByRole("textbox")).toHaveValue('George Franklin')
    await expect(page.locator('.form-group', {hasText: "Type"}).getByRole("textbox")).toHaveValue('cat')

    const petTypeDropDown = page.locator('#type')
    const types = ["cat", "dog", "lizard", "snake", "bird", "hamster"]
    await petTypeDropDown.click()
    for(const type of types){
        await petTypeDropDown.selectOption(type)
        await expect(page.locator('.form-group', {hasText: "Type"}).getByRole("textbox")).toHaveValue(type)
        await petTypeDropDown.click()
    }
  
  })

  
test('Validate the pet type update', async({page}) => {
    
    await page.getByRole('button', {name: "Owners"}).click()
    await page.getByRole('link', {name: "Search"}).click()

    await expect(page.getByRole('heading')).toHaveText("Owners")
    await page.getByText("Eduardo Rodriquez").click()

    const rosyPetSection = page.locator('app-pet-list', {hasText: "Rosy"})
    const rosyEditPetButton = rosyPetSection.getByRole('button', {name: "Edit Pet"})
    await rosyEditPetButton.click()

    const petTypeDisplayField = page.locator('.form-group', {hasText: "Type"}).getByRole("textbox")
    const petTypeDropDown = page.locator('#type')
    await expect(petTypeDisplayField).toHaveValue('dog')
    await petTypeDropDown.selectOption('bird')
    await expect(petTypeDisplayField).toHaveValue('bird')
    await expect(petTypeDropDown).toHaveValue("bird")
    await page.getByRole('button', {name: "Update Pet"}).click()

    await expect(rosyPetSection).toContainText("bird")
    await rosyEditPetButton.click()

    await expect(petTypeDisplayField).toHaveValue('bird')
    await petTypeDropDown.selectOption('dog')
    await expect(petTypeDisplayField).toHaveValue('dog')
    await expect(petTypeDropDown).toHaveValue("dog")
    await page.getByRole('button', {name: "Update Pet"}).click()
    
  
  })