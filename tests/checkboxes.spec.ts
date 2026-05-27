import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Validate selected specialties", async ({ page }) => {

  await page.getByRole("button", { name: "Veterinarians" }).click();
  await page.getByRole("link", { name: "All" }).click();

  await expect(page.getByRole('heading')).toHaveText('Veterinarians');

  await page.getByRole('row', {name: 'Helen Leary'}).getByRole("button", { name: "Edit Vet" }).click()

  const specialtiesDropDown = page.locator(".selected-specialties");
  await expect(specialtiesDropDown).toHaveText("radiology");

  await specialtiesDropDown.click();

  expect(await page.getByRole("checkbox", { name: "radiology" }).isChecked()).toBeTruthy();

  expect(await page.getByRole("checkbox", { name: "surgery" }).isChecked()).toBeFalsy();
  expect(await page.getByRole("checkbox", { name: "dentistry" }).isChecked(),).toBeFalsy();

  await page.getByRole("checkbox", { name: "surgery" }).check();
  await page.getByRole("checkbox", { name: "radiology" }).uncheck();

  await expect(specialtiesDropDown).toHaveText("surgery");

  await page.getByRole("checkbox", { name: "dentistry" }).check();

  await expect(specialtiesDropDown).toHaveText("surgery, dentistry");
});

test("Select all specialties", async ({ page }) => {

  await page.getByRole("button", { name: "Veterinarians" }).click();
  await page.getByRole("link", { name: "All" }).click();

  await page.getByRole('row', {name: 'Rafael Ortega'}).getByRole("button", { name: "Edit Vet" }).click()

  const specialtiesDisplay = page.locator(".selected-specialties");
  await expect(specialtiesDisplay).toHaveText("surgery");

  await specialtiesDisplay.click();

  const allSpecialtiesBoxes = await page.getByRole("checkbox").all();
  //const allCheckedSpecialties = []
  for (const specialty of allSpecialtiesBoxes) {
    await specialty.check();
    expect(await specialty.isChecked()).toBeTruthy();
    //allCheckedSpecialties.push(await specialty.getAttribute('id'));
  }
  
  const allCheckedSpecialties = await page.locator('input:checked + label').allTextContents();

  const specialtiesDisplayContent = await specialtiesDisplay.textContent();

  for (const specialty of allCheckedSpecialties) {
    expect(specialtiesDisplayContent).toContain(specialty);
  }
});

test("Unselect all specialties", async ({ page }) => {

  await page.getByRole('button', { name: "Veterinarians" }).click();
  await page.getByRole('link', { name: "All" }).click();

  await page.getByRole('row', {name: 'Linda Douglas'}).getByRole("button", { name: "Edit Vet" }).click()

  const specialtiesDisplay = page.locator(".selected-specialties");
  await expect(specialtiesDisplay).toHaveText("dentistry, surgery");

  await specialtiesDisplay.click();

  const allSpecialties = await page.getByRole("checkbox").all();
  for (const specialty of allSpecialties) {
    await specialty.uncheck();
    await expect(specialty).not.toBeChecked();
  }

  await expect(specialtiesDisplay).toBeEmpty();
});
