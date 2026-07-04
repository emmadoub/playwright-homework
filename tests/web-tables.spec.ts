import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Owners Page Test Cases", () => {

  test.beforeEach(async ({ page }) => {
    await page.getByRole("button", { name: "Owners" }).click()
    await page.getByRole("link", { name: "Search" }).click()
  })

  test("Validate the pet name city of the owner", async ({ page }) => {

    await expect(page.getByRole("row", { name: "Jeff Black " }).locator('td').nth(2)).toHaveText('Monona')
    await expect(page.getByRole("row", { name: "Jeff Black " }).locator('td').nth(4)).toHaveText('Lucky')

  });

  test("Validate owners count of the Madison city", async ({ page }) => {

    await expect(page.getByRole("row", { name: "Madison" })).toHaveCount(4)

  });

  test('Validate search by Last Name', async ({ page }) => {

    const searchValues = ["Black", "Davis", "Es", "Playwright"]

    for (let searchValue of searchValues) {
      await page.locator('#lastName').fill(searchValue)
      await page.getByRole('button', { name: "Find Owner" }).click()
      await page.waitForResponse('**/api/owners*')
      if (searchValue === "Playwright") {
        await expect(page.getByText(`No owners with LastName starting with "${searchValue}"`)).toBeVisible()
      }
      else {
        for (const ownerCell of await page.locator('.ownerFullName').all()) {
          const lastName = (await ownerCell.textContent())!.split(' ').pop()
          if (searchValue === "Es") {
            expect(lastName).toContain(searchValue)
          }
          else {
            expect(lastName).toEqual(searchValue)
          }
        }

      }
    }

  })

  test('Validate phone number and pet name on the Owner Information page', async ({ page }) => {

    const phoneNumber = "6085552765"
    const ownerRow = page.getByRole('row', { name: phoneNumber })
    const ownerFullName = await ownerRow.locator('.ownerFullName').textContent() 
    const petName = await ownerRow.locator('td').last().textContent() 
    await page.getByRole('link', { name: ownerFullName! }).click()

    await expect(page.locator('tr', { hasText: "Telephone" }).locator('td')).toHaveText(phoneNumber)
    await expect(page.locator('app-pet-list').locator('dt:text-is("Name") + dd')).toHaveText(petName!)

  })

  test('Validate pets of the Madison city', async ({ page }) => {
    const madisonCityPets = ["Leo", "George", "Mulligan", "Freddy"]
    const madisonCityPetList = []
    await page.getByRole('row', { name: 'Madison' }).first().waitFor()
    const madisonRows = page.getByRole('row', { name: 'Madison' })
    for (let row of await madisonRows.all()) {
      madisonCityPetList.push((await row.locator('td').last().textContent())!.trim())
    }

    expect(madisonCityPetList).toEqual(expect.arrayContaining(madisonCityPets))

  })


});


test('Validate specialty update', async ({ page }) => {
  await page.getByRole("button", { name: "Veterinarians" }).click()
  await page.getByRole("link", { name: "All" }).click()

  await expect(page.getByRole('row', { name: "Rafael Ortega" }).locator('td').nth(1)).toHaveText('surgery')

  await page.getByRole("link", { name: "Specialties" }).click()
  await expect(page.getByRole("heading", { name: "Specialties" }),).toBeVisible()

  await page.getByRole('row', { name: "surgery" }).getByRole('button', { name: "Edit" }).click()
  await expect(page.getByRole("heading", { name: "Edit Specialty" }),).toBeVisible()
  await page.locator('#name').fill("dermatology")
  await page.getByRole("button", { name: "Update" }).click()

  await expect(page.getByRole('row', { name: "surgery" })).not.toBeVisible()
  await expect(page.getByRole("textbox").nth(1)).toHaveValue("dermatology")

  await page.getByRole("button", { name: "Veterinarians" }).click()
  await page.getByRole("link", { name: "All" }).click()

  await expect(page.getByRole('row', { name: "Rafael Ortega" }).locator('td').nth(1)).toHaveText('dermatology')

  await page.getByRole("link", { name: "Specialties" }).click()
  await page.getByRole('row', { name: "dermatology" }).getByRole('button', { name: "Edit" }).click()
  await expect(page.locator('#name')).toHaveValue("dermatology")
  await page.locator('#name').fill("surgery")
  await page.getByRole("button", { name: "Update" }).click()


})

test('Validate specialty lists', async ({ page }) => {
  await page.getByRole("link", { name: "Specialties" }).click()
  await page.getByRole('button', { name: "Add" }).click()
  await page.locator('#name').fill('oncology')
  await page.getByRole('button', { name: "Save" }).click()
  const specialtyInputs = page.getByRole('textbox')
  await expect(specialtyInputs.last()).toHaveValue('oncology')

  const specialtiesList = []

  for (let specialty of await specialtyInputs.all()) {
    specialtiesList.push(await specialty.inputValue())
  }

  await page.getByRole("button", { name: "Veterinarians" }).click()
  await page.getByRole("link", { name: "All" }).click()

  await page.getByRole('row', { name: "Sharon Jenkins" }).getByRole('button', { name: "Edit" }).click()
  const specialtyDropDownValues = []
  const specialtyCheckboxItems = page.locator('.dropdown-content label')
  await page.locator(".dropdown-display").click()
  for (let specialty of await specialtyCheckboxItems.all()) {
    specialtyDropDownValues.push(await specialty.textContent())
  }
  expect(specialtiesList).toEqual(specialtyDropDownValues)
  await page.getByRole('checkbox', { name: "oncology" }).check()
  await page.locator('body').click();
  await page.getByRole("button", { name: "Save Vet" }).click()
  await expect(page.getByRole('row', { name: "Sharon Jenkins" }).locator('td').nth(1)).toHaveText("oncology")
  await page.getByRole("link", { name: "Specialties" }).click()
  await page.getByRole('row', { name: "oncology" }).getByRole('button', { name: "Delete" }).click()
  await page.getByRole("button", { name: "Veterinarians" }).click()
  await page.getByRole("link", { name: "All" }).click();
  await expect(page.getByRole('row', { name: "Sharon Jenkins" }).locator('td').nth(1)).toBeEmpty()



})





