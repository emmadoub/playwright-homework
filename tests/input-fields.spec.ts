import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Update pet type", async ({ page }) => {
  // 1. Select the PET TYPES menu item in the navigation bar

  await page.getByRole("link", { name: "Pet Types" }).click();

  // 2. Add assertion of the "Pet Types" text displayed above the table with the list of pet types

  const divPetTypesTable = page
    .locator("div")
    .filter({ has: page.locator("table") });
  await expect(divPetTypesTable.getByRole("heading")).toHaveText("Pet Types");

  // 3. Click on "Edit" button for the "cat" pet type

  const catRow = page
    .locator("tr")
    .filter({ has: page.locator('input[id="0"]') });
  await catRow.getByRole("button", { name: "Edit" }).click();

  // 4. Add assertion of the "Edit Pet Type" text displayed

  await expect(
    page.getByRole("heading", { name: "Edit Pet Type" }),
  ).toBeVisible();

  // 5. Change the pet type name from "cat" to "rabbit" and click "Update" button

  const nameInput = page.locator('input[id="name"]');
  await nameInput.click();
  await nameInput.clear();
  await nameInput.fill("rabbit");
  await nameInput.blur();
  await page.getByRole("button", { name: "Update" }).click();

  // 6. Add the assertion that the first pet type in the list of types has a value "rabbit"

  const firstInput = page.locator("tbody tr input").first();
  await expect(firstInput).toHaveValue("rabbit");

  // 7. Click on "Edit" button for the same "rabbit" pet type

  const firstRow = page.locator("tbody tr").first();
  await firstRow.getByRole("button", { name: "Edit" }).click();

  // 8. Change the pet type name back from "rabbit" to "cat" and click "Update" button

  const nameInputV2 = page.locator('input[id="name"]');
  await nameInputV2.click();
  await nameInputV2.clear();
  await nameInputV2.fill("cat");
  await nameInputV2.blur();
  await page.getByRole("button", { name: "Update" }).click();

  // 9. Add the assertion that the first pet type in the list of names has a value "cat"

  const firstInputV2 = page.locator("tbody tr input").first();
  await expect(firstInputV2).toHaveValue("cat");
});

test("Cancel pet type update", async ({ page }) => {
  //1. Select the PET TYPES menu item in the navigation bar

  await page.getByRole("link", { name: "Pet Types" }).click();

  // 2. Add assertion of the "Pet Types" text displayed above the table with the list of pet types

  const divPetTypesTable = page.locator("div:has(table)");
  await expect(divPetTypesTable.getByRole("heading")).toHaveText("Pet Types");

  // 3. Click on "Edit" button for the "dog" pet type

  const dogRow = page
    .locator("tr")
    .filter({ has: page.locator('input[id="1"]') });
  await dogRow.getByRole("button", { name: "Edit" }).click();

  // 4. Type the new pet type name "moose"

  const nameInput = page.locator('input[id="name"]');
  await nameInput.click();
  await nameInput.clear();
  await nameInput.fill("moose");

  // 5. Add assertion the value "moose" is displayed in the input field of the "Edit Pet Type" page

  await expect(nameInput).toHaveValue("moose");

  // 6. Click on "Cancel" button

  await page.getByRole("button", { name: "Cancel" }).click();

  // 7. Add the assertion the value "dog" is still displayed in the list of pet types
  await expect(page.getByRole("cell", { name: "dog" })).toBeVisible();
});

test("Validation of Pet type name is required", async ({ page }) => {
  // 1. Select the PET TYPES menu item in the navigation bar

  await page.getByRole("link", { name: "Pet Types" }).click();

  // 2. Add assertion of the "Pet Types" text displayed above the table with the list of pet types

  const divPetTypesTable = page.locator("div:has(table)");
  await expect(divPetTypesTable.getByRole("heading")).toHaveText("Pet Types");

  // 3. Click on "Edit" button for the "lizard" pet type
  const dogRow = page
    .locator("tr")
    .filter({ has: page.locator('input[id="2"]') });
  await dogRow.getByRole("button", { name: "Edit" }).click();

  //4. On the Edit Pet Type page, clear the input field
  const nameInput = page.locator('input[id="name"]');
  await nameInput.click();
  await nameInput.clear();

  // 5. Add the assertion for the "Name is required" message below the input field

  await expect(page.getByText("Name is required")).toBeVisible();

  // 6. Click on "Update" button

  await page.getByRole("button", { name: "Update" }).click();

  // 7. Add assertion that "Edit Pet Type" page is still displayed

  await expect(
    page.getByRole("heading", { name: "Edit Pet Type" }),
  ).toBeVisible();

  // 8. Click on the "Cancel" button

  await page.getByRole("button", { name: "Cancel" }).click();

  // 9. Add assertion that "Pet Types" page is displayed

  await expect(page.getByRole("heading", { name: "Pet Types" })).toBeVisible();
});
