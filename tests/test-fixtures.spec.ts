import { expect } from '@playwright/test';
import { test } from '../test-options'



test('Test with fixtures', async ({ page, testData , ownersPage }) => {

  await page.getByText(testData.ownerName).click()
  await expect(page.getByText(testData.visitDescription)).toBeVisible()
  await expect(page.getByText(testData.petName)).toBeVisible()
  await page.getByText("Delete Visit").click()
  await page.waitForResponse('**/api/visits/*')
  await expect(page.getByText(testData.visitDescription)).not.toBeVisible()
  await page.getByText("Delete Pet").click()
  await page.waitForResponse('**/api/pets/*')
  await expect(page.getByText(testData.petName)).not.toBeVisible()

});