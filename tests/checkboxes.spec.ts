import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Validate selected specialties", async ({ page }) => {
  // 1. Select the VETERINARIANS menu item in the navigation bar, then select "All"

  await page.getByRole("button", { name: "Veterinarians" }).click();
  await page.getByRole("link", { name: "All" }).click();

  // 2. Add assertion of the "Veterinarians" text displayed above the table with the list of Veterinarians

  const divPetTypesTable = page
    .locator("div")
    .filter({ has: page.locator("table") });
  await expect(divPetTypesTable.getByRole("heading")).toHaveText(
    "Veterinarians",
  );

  // 3. Select the veterinarian "Helen Leary" and click "Edit Vet" button

  await page
    .locator("tr")
    .filter({ hasText: "Helen Leary" })
    .getByRole("button", { name: "Edit Vet" })
    .click();

  // 4. Add assertion of the "Specialties" field. The value "radiology" is displayed

  const specialtiesDropDown = page.locator(".selected-specialties");
  await expect(specialtiesDropDown).toHaveText("radiology");

  // 5. Click on the "Specialties" drop-down menu

  await specialtiesDropDown.click();

  // 6. Add assertion that "radiology" specialty is checked

  expect(
    await page.getByRole("checkbox", { name: "radiology" }).isChecked(),
  ).toBeTruthy();

  // 7. Add assertion that "surgery" and "dentistry" specialties are unchecked
  expect(
    await page.getByRole("checkbox", { name: "surgery" }).isChecked(),
  ).toBeFalsy();
  expect(
    await page.getByRole("checkbox", { name: "dentistry" }).isChecked(),
  ).toBeFalsy();

  // 8. Check the "surgery" item specialty and uncheck the "radiology" item speciality

  await page.getByRole("checkbox", { name: "surgery" }).check();
  await page.getByRole("checkbox", { name: "radiology" }).uncheck();

  // 9. Add assertion of the "Specialties" field displayed value "surgery"

  await expect(specialtiesDropDown).toHaveText("surgery");

  // 10. Check the "dentistry" item specialty

  await page.getByRole("checkbox", { name: "dentistry" }).check();

  // 11. Add assertion of the "Specialties" field. The value "surgery, dentistry" is displayed

  await expect(specialtiesDropDown).toHaveText("surgery, dentistry");
});

test("Select all specialties", async ({ page }) => {
  // 1. Select the VETERINARIANS menu item in the navigation bar, then select "All"

  await page.getByRole("button", { name: "Veterinarians" }).click();
  await page.getByRole("link", { name: "All" }).click();

  // 2. Select the veterinarian "Rafael Ortega" and click "Edit Vet" button

  await page
    .locator("tr")
    .filter({ hasText: "Rafael Ortega" })
    .getByRole("button", { name: "Edit Vet" })
    .click();

  // 3. Add assertion that "Specialties" field is displayed value "surgery"

  const specialtiesDropDown = page.locator(".selected-specialties");
  await expect(specialtiesDropDown).toHaveText("surgery");

  // 4. Click on the "Specialties" drop-down menu

  await specialtiesDropDown.click();

  // 5. Check all specialties from the list
  const allSpecialties = await page.getByRole("checkbox").all();
  for (const specialty of allSpecialties) {
    await specialty.check();
  }

  // 6. Add assertion that all specialties are checked
  for (const specialty of allSpecialties) {
    expect(await specialty.isChecked()).toBeTruthy();
  }

  // 7. Add assertion that all checked specialities are displayed in the "Specialties" field

  const checkedSpecialties = await page
    .locator('.dropdown-content input[type="checkbox"]:checked + label')
    .allTextContents();

  const specialtiesText = await specialtiesDropDown.textContent();

  for (const specialty of checkedSpecialties) {
    expect(specialtiesText).toContain(specialty);
  }
});

test("Unselect all specialties", async ({ page }) => {
  //1. Select the VETERINARIANS menu item in the navigation bar, then select "All"

  await page.getByRole("button", { name: "Veterinarians" }).click();
  await page.getByRole("link", { name: "All" }).click();

  // 2. Select the veterinarian "Linda Douglas" and click "Edit Vet" button

  await page
    .locator("tr")
    .filter({ hasText: "Linda Douglas" })
    .getByRole("button", { name: "Edit Vet" })
    .click();

  // 3. Add assertion of the "Specialties" field displayed value "dentistry, surgery"

  const specialtiesDropDown = page.locator(".selected-specialties");
  await expect(specialtiesDropDown).toHaveText("dentistry, surgery");

  // 4. Click on the "Specialties" drop-down menu

  await specialtiesDropDown.click();

  // 5. Uncheck all specialties from the list

  const allSpecialties = await page.getByRole("checkbox").all();
  for (const specialty of allSpecialties) {
    await specialty.uncheck();
  }

  // 6. Add assertion that all specialties are unchecked

  for (const specialty of allSpecialties) {
    expect(await specialty.isChecked()).toBeFalsy();
  }

  // 7. Add assertion that "Specialties" field is empty
  await expect(specialtiesDropDown).toBeEmpty();
});
