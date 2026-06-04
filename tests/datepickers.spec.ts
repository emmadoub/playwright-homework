import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {

    await page.goto("/")
    await page.getByRole("button", { name: "Owners" }).click()
    await page.getByRole("link", { name: "Search" }).click()

})

test('Select the desired date in the calendar', async ({ page }) => {

    const ownerLink = page.getByRole('link', { name: "Harold Davis" })
    const href = await ownerLink.getAttribute('href');
    await ownerLink.click()
    await page.waitForResponse(`**/api${href}`)
    await page.getByRole('button', { name: "Add New Pet" }).click()
    await page.waitForResponse('**/api/pettypes')
    const newPetName = "Tom"
    await page.getByRole('textbox', { name: "Name" }).fill(newPetName)
    await expect(page.locator('.col-sm-10', { has: page.getByRole('textbox', { name: "Name" }) }).locator('.glyphicon-ok')).toBeVisible()

    await page.getByRole('button', { name: 'Open Calendar' }).click()
    await page.getByRole('button', { name: 'Choose month and year' }).click()
    await page.getByRole('button', { name: 'Previous 24 years' }).click()
    await page.getByRole('button', { name: "2014" }).click()
    await page.getByRole('button').getByText("MAY").click()
    await page.getByRole('button').getByText("2", { exact: true }).click()
    await expect(page.locator('.mat-datepicker-input')).toHaveValue('2014/05/02')

    await page.locator("#type").selectOption("dog")
    await page.getByRole('button', { name: "Save Pet" }).click()

    const newPetSection = page.locator("app-pet-list", { hasText: newPetName })
    await expect(newPetSection.locator('dt:text-is("Name") + dd')).toHaveText(newPetName)
    await expect(newPetSection.locator('dt:text-is("Birth Date") + dd')).toHaveText('2014-05-02')
    await expect(newPetSection.locator('dt:text-is("Type") + dd')).toHaveText('dog')

    await newPetSection.getByRole('button', { name: "Delete Pet" }).click()
    await page.waitForResponse('**/pets/*')
    await expect(newPetSection).not.toBeVisible()

})

test('Select the dates of visits and validate dates order', async ({ page }) => {

    const ownerLink = page.getByRole('link', { name: "Jean Coleman" })
    const href = await ownerLink.getAttribute('href');
    await ownerLink.click()
    await page.waitForResponse(`**/api${href}`)
    const samanthaPetSection = page.locator("app-pet-list", { hasText: "Samantha" })
    await samanthaPetSection.getByRole('button', { name: "Add visit" }).click()

    await expect(page.getByRole('heading')).toHaveText("New Visit")
    await expect(page.locator('.table-striped td').first()).toHaveText("Samantha")
    await expect(page.locator('.table-striped td').last()).toHaveText("	Jean Coleman")


    let date = new Date()
    let expectedCalendarDate = date.getDate().toString()
    let expectedDate = String(date.getDate()).padStart(2, '0')
    let expectedMonth = String(date.getMonth() + 1).padStart(2, '0')
    let expectedYear = date.getFullYear().toString()
    let expectedFullDate = `${expectedYear}/${expectedMonth}/${expectedDate}`

    await page.getByRole('button', { name: 'Open Calendar' }).click()
    await page.getByRole('button').getByText(expectedCalendarDate, { exact: true }).click()
    await expect(page.locator('.mat-datepicker-input')).toHaveValue(expectedFullDate)
    await page.locator('#description').fill("dermatologist's visit")
    await page.getByRole('button', { name: "Add Visit" }).click()

    const samanthaVisitTable = samanthaPetSection.locator('app-visit-list')
    await expect(samanthaVisitTable.locator('td').first()).toHaveText(`${expectedYear}-${expectedMonth}-${expectedDate}`)
    await samanthaPetSection.getByRole('button', { name: "Add visit" }).click()
    date.setDate(date.getDate() - 45)
    expectedCalendarDate = date.getDate().toString()
    expectedDate = String(date.getDate()).padStart(2, '0')
    expectedMonth = String(date.getMonth() + 1).padStart(2, '0')
    expectedYear = date.getFullYear().toString()

    await page.getByRole('button', { name: 'Open Calendar' }).click()
    let calendarMonthAndYear = await page.getByRole('button', { name: 'Choose month and year' }).textContent()
    const expectedMonthAndYear = `${expectedMonth} ${expectedYear}`
    while (!calendarMonthAndYear?.includes(expectedMonthAndYear)) {
        await page.getByRole('button', { name: 'Previous month' }).click()
        calendarMonthAndYear = await page.getByRole('button', { name: 'Choose month and year' }).textContent()
    }
    await page.getByRole('button').getByText(expectedCalendarDate, { exact: true }).click()
    await page.locator('#description').fill("massage therapy")
    await page.getByRole('button', { name: "Add Visit" }).click()

    const firstVisitDateString = (await samanthaVisitTable.locator('td').first().textContent())!.toString()
    const secondVisitDateString = (await samanthaVisitTable.locator('tr').nth(2).locator('td').first().textContent())!.toString()

    const firstVisitDate = new Date(firstVisitDateString)
    const secondVisitDate = new Date(secondVisitDateString)

    expect(firstVisitDate > secondVisitDate).toBeTruthy()

    await samanthaVisitTable.locator('tr', { hasText: firstVisitDateString }).getByRole('button', { name: "Delete Visit" }).click()
    await samanthaVisitTable.locator('tr', { hasText: secondVisitDateString }).getByRole('button', { name: "Delete Visit" }).click()

    await page.waitForResponse('**/visits/*')
    await expect(samanthaVisitTable.locator('tr', { hasText: firstVisitDateString })).not.toBeVisible()
    await expect(samanthaVisitTable.locator('tr', { hasText: secondVisitDateString })).not.toBeVisible()

})

