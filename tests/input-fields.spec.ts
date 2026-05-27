import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Update pet type", async ({ page }) => {

  await page.getByRole('link', { name: "Pet Types" }).click();

  await expect(page.getByRole('heading')).toHaveText("Pet Types");

  await page.getByRole('row', { name: 'cat' }).getByRole('button', { name: 'Edit' }).click();

  await expect(page.getByRole('heading')).toHaveText('Edit Pet Type');
  
  const petType = page.getByRole('textbox'); 
  await expect(petType).toHaveValue('cat');
  await petType.fill('rabbit');
  await page.getByRole('button', { name: "Update" }).click();

  await expect(page.locator('[id="0"]')).toHaveValue('rabbit');
 
  await page.getByRole('row', { name: 'rabbit' }).getByRole('button', { name: 'Edit' }).click();

  await expect(petType).toHaveValue('rabbit')
  await petType.fill('cat');
  await page.getByRole('button', { name: "Update" }).click();

  await expect(page.locator('[id="0"]')).toHaveValue('cat');
});

test("Cancel pet type update", async ({ page }) => {

  await page.getByRole('link', { name: "Pet Types" }).click();

  await expect(page.getByRole('heading')).toHaveText("Pet Types");

  await page.getByRole('row', { name: 'dog' }).getByRole('button', { name: 'Edit' }).click();

  const petType = page.getByRole('textbox'); 
  await expect(petType).toHaveValue('dog')
  await petType.fill('moose');

  await expect(petType).toHaveValue('moose');

  await page.getByRole('button', { name: "Cancel" }).click();

  await expect(page.getByRole('row', { name: "dog" })).toBeVisible();
});

test("Validation of Pet type name is required", async ({ page }) => {

  await page.getByRole('link', { name: "Pet Types" }).click();

  await expect(page.getByRole('heading')).toHaveText("Pet Types");

  await page.getByRole('row', { name: 'lizard' }).getByRole('button', { name: 'Edit' }).click();

  const petType = page.getByRole('textbox'); 
  await expect(petType).toHaveValue('lizard')
  await petType.clear();

  await expect(page.locator('.help-block')).toHaveText("Name is required");

  await page.getByRole('button', { name: "Update" }).click();

  await expect(page.getByRole('heading')).toHaveText("Edit Pet Type");

  await page.getByRole('button', { name: "Cancel" }).click();

  await expect(page.getByRole('heading')).toHaveText("Pet Types");
});
