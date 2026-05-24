import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test('Update pet type', async ({page}) => {

   // 1. Select the PET TYPES menu item in the navigation bar

   await page.getByRole('link', { name: 'Pet Types' }).click()

   // 2. Add assertion of the "Pet Types" text displayed above the table with the list of pet types

   const divPetTypesTable = page.locator('div').filter({has: page.locator('table')})
   //const divPetTypestable = page.locator('div:has(table)') 
   await expect(divPetTypesTable.getByRole('heading')).toHaveText('Pet Types')

   // 3. Click on "Edit" button for the "cat" pet type

   const catRow = page.locator('tr').filter({has: page.locator('input[id="0"]')})
   await catRow.getByRole('button', { name: 'Edit' }).click()

   // 4. Add assertion of the "Edit Pet Type" text displayed

   await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible()

   // 5. Change the pet type name from "cat" to "rabbit" and click "Update" button

   const nameInput = page.locator('input[id="name"]')
   await nameInput.click()
   await nameInput.clear()
   await nameInput.fill('rabbit')
   await nameInput.blur()
   await page.getByRole('button', {name: 'Update'}).click() 

   // 6. Add the assertion that the first pet type in the list of types has a value "rabbit" 
   
   const firstInput = page.locator('tbody tr input').first()
   await expect(firstInput).toHaveValue('rabbit')

   // 7. Click on "Edit" button for the same "rabbit" pet type

   const firstRow = page.locator('tbody tr').first()
   await firstRow.getByRole('button', { name: 'Edit' }).click()

   // 8. Change the pet type name back from "rabbit" to "cat" and click "Update" button

   const nameInputV2 = page.locator('input[id="name"]')
   await nameInputV2.click()
   await nameInputV2.clear()
   await nameInputV2.fill('cat')
   await nameInputV2.blur()
   await page.getByRole('button', {name: 'Update'}).click() 

   // 9. Add the assertion that the first pet type in the list of names has a value "cat" 
   
   const firstInputV2 = page.locator('tbody tr input').first()
   await expect(firstInputV2).toHaveValue('cat')

});

