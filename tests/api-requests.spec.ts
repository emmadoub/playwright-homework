import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Validation of delete specialty', async ({ page, request }) => {

  const specialtyResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
    data: { "name": "api testing expert" }
  })

  expect(specialtyResponse.status()).toEqual(201)

  await page.getByRole("link", { name: "Specialties" }).click()
  await expect(page.getByRole('row', { name: "api testing expert" })).toBeVisible()
  await page.getByRole('row', { name: "api testing expert" }).getByRole('button', { name: "Delete" }).click()
  await page.waitForResponse('**/specialties/*')
  await expect(page.getByRole('row', { name: "api testing expert" })).not.toBeVisible()

})

test("Add and delete veterinarian", async ({ page, request }) => {

  const newVeterinarianResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
    data: { "firstName": "Playwright", "lastName": "Genius", "id": null, "specialties": [] }
  })
  expect(newVeterinarianResponse.status()).toEqual(201)
  const newVeterinarianBody = await newVeterinarianResponse.json();
  expect(newVeterinarianBody.firstName).toEqual("Playwright")
  expect(newVeterinarianBody.lastName).toEqual("Genius");
  const newVeterinarianId = newVeterinarianBody.id;
  await page.getByRole("button", { name: "Veterinarians" }).click()
  await page.getByRole("link", { name: "All" }).click()
  const newVeterinarianRow = page.getByRole('row', { name: `${newVeterinarianBody.firstName} ${newVeterinarianBody.lastName}` })
  await expect(newVeterinarianRow).toBeVisible()
  await expect(newVeterinarianRow.locator('td').nth(1)).toBeEmpty()
  await newVeterinarianRow.getByRole("button", { name: "Edit Vet" }).click()
  await page.locator(".dropdown-display").click()
  await page.getByRole('checkbox', { name: "dentistry" }).check()
  await page.locator(".dropdown-display").click()
  await page.getByRole("button", { name: "Save Vet" }).click()
  await expect(newVeterinarianRow.locator('td').nth(1)).toHaveText("dentistry")
  const deleteVeterinarianResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${newVeterinarianId}`)
  expect(deleteVeterinarianResponse.status()).toEqual(204)
  const getVeterinariansResponse = await request.get('https://petclinic-api.bondaracademy.com/petclinic/api/vets')
  const allVets = await getVeterinariansResponse.json()
  for (let vet of allVets) {
    expect(vet.id).not.toEqual(newVeterinarianId)
  }

})

test("New specialty is displayed", async ({ page, request }) => {

  const getSpecialtiesResponse = await request.get('https://petclinic-api.bondaracademy.com/petclinic/api/specialties')
  const specialtiesBody = await getSpecialtiesResponse.json()
  const surgerySpecialty = specialtiesBody.find(
    (specialty: { id: number; name: string }) =>
      specialty.name === 'surgery'
  )
  const newSpecialtyResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
    data: { "name": "api testing ninja" }
  })
  expect(newSpecialtyResponse.status()).toEqual(201)
  const newSpecialtyBody = await newSpecialtyResponse.json()
  const newSpecialtyId = newSpecialtyBody.id

  const newVeterinarianResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
    data: { "firstName": "Alex", "lastName": "Postman", "id": null, "specialties": [surgerySpecialty] }
  })

  expect(newVeterinarianResponse.status()).toEqual(201)
  const newVeterinarianBody = await newVeterinarianResponse.json()
  const newVeterinarianId = newVeterinarianBody.id

  await page.getByRole("button", { name: "Veterinarians" }).click()
  await page.getByRole("link", { name: "All" }).click()
  const newVeterinarianRow = page.getByRole('row', { name: `${newVeterinarianBody.firstName} ${newVeterinarianBody.lastName}` })
  await expect(newVeterinarianRow).toBeVisible()
  await expect(newVeterinarianRow.locator('td').nth(1)).toHaveText("surgery")
  await newVeterinarianRow.getByRole("button", { name: "Edit Vet" }).click()
  await page.locator(".dropdown-display").click()
  await page.getByRole('checkbox', { name: "surgery" }).uncheck()
  await page.getByRole('checkbox', { name: "api testing ninja" }).check()
  await page.locator(".dropdown-display").click()
  await page.getByRole("button", { name: "Save Vet" }).click()
  await expect(newVeterinarianRow.locator('td').nth(1)).toHaveText("api testing ninja")

  const deleteVeterinarianResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${newVeterinarianId}`)
  expect(deleteVeterinarianResponse.status()).toEqual(204)
  const deleteSpecialtyResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/specialties/${newSpecialtyId}`)
  expect(deleteSpecialtyResponse.status()).toEqual(204)

  await page.getByRole("link", { name: "Specialties" }).click()
  await page.waitForResponse('**/specialties')
  await expect(page.getByRole("row", { name: "api testing ninja" })).not.toBeVisible()

})



