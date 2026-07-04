import { expect } from '@playwright/test';
import { test } from '../owners-fixtures'



test('Test with fixtures', async ({ page, ownersPage }) => {

  await page.getByText(ownersPage.ownerName).click()
  await expect(page.getByText(ownersPage.visitDescription)).toBeVisible()
  await expect(page.getByText(ownersPage.petName)).toBeVisible()
  await page.getByText("Delete Visit").click()
  await page.waitForResponse('**/api/visits/*')
  await expect(page.getByText(ownersPage.visitDescription)).not.toBeVisible()
  await page.getByText("Delete Pet").click()
  await page.waitForResponse('**/api/pets/*')
  await expect(page.getByText(ownersPage.petName)).not.toBeVisible()

});