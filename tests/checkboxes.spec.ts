import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Validate selected specialties", async ({ page }) => {

  await page.getByRole("button", { name: "Veterinarians" }).click();
  await page.getByRole("link", { name: "All" }).click();

  await expect(page.getByRole('heading')).toHaveText('Veterinarians');

  await page.getByRole('row', {name: 'Helen Leary'}).getByRole("button", { name: "Edit Vet" }).click()

  const specialtiesDropDownField = page.locator(".selected-specialties");
  await expect(specialtiesDropDownField).toHaveText("radiology");

  await specialtiesDropDownField.click();

  expect(await page.getByRole("checkbox", { name: "radiology" }).isChecked()).toBeTruthy();

  expect(await page.getByRole("checkbox", { name: "surgery" }).isChecked()).toBeFalsy();
  expect(await page.getByRole("checkbox", { name: "dentistry" }).isChecked(),).toBeFalsy();

  await page.getByRole("checkbox", { name: "surgery" }).check();
  await page.getByRole("checkbox", { name: "radiology" }).uncheck();

  await expect(specialtiesDropDownField).toHaveText("surgery");

  await page.getByRole("checkbox", { name: "dentistry" }).check();

  await expect(specialtiesDropDownField).toHaveText("surgery, dentistry");
});

test("Select all specialties", async ({ page }) => {

  await page.getByRole("button", { name: "Veterinarians" }).click();
  await page.getByRole("link", { name: "All" }).click();

  await page.getByRole('row', {name: 'Rafael Ortega'}).getByRole("button", { name: "Edit Vet" }).click()

  const specialtiesDropDownField = page.locator(".selected-specialties");
  await expect(specialtiesDropDownField).toHaveText("surgery");

  await specialtiesDropDownField.click();

  const allSpecialtyBoxes = await page.getByRole("checkbox").all();
  for (const specialty of allSpecialtyBoxes) {
    await specialty.check();
    expect(await specialty.isChecked()).toBeTruthy();
  }
  
  const allCheckedSpecialtiesValues = await page.getByRole("checkbox").allTextContents();

  const specialtiesDisplayContent = await specialtiesDropDownField.textContent();

  for (const specialty of allCheckedSpecialtiesValues) {
    expect(specialtiesDisplayContent).toContain(specialty);
  }
});

test("Unselect all specialties", async ({ page }) => {

  await page.getByRole('button', { name: "Veterinarians" }).click();
  await page.getByRole('link', { name: "All" }).click();

  await page.getByRole('row', {name: 'Linda Douglas'}).getByRole("button", { name: "Edit Vet" }).click()

  const specialtiesDropDownField = page.locator(".selected-specialties");
  await expect(specialtiesDropDownField).toHaveText("dentistry, surgery");

  await specialtiesDropDownField.click();

  const allSpecialtyBoxes = await page.getByRole("checkbox").all();
  for (const specialty of allSpecialtyBoxes) {
    await specialty.uncheck();
    await expect(specialty).not.toBeChecked();
  }

  await expect(specialtiesDropDownField).toBeEmpty();
});
