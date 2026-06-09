import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {

    await page.goto("/")
    await page.getByRole("button", { name: "Owners" }).click()
    await page.getByRole("link", { name: "Search" }).click()

})

test('Select the desired date in the calendar', async ({ page }) => {

    await page.getByRole('link', { name: "Harold Davis" }).click()
    await page.getByRole('button', { name: "Add New Pet" }).click()
    await expect(page.locator('.glyphicon-remove').first()).toBeVisible()
    await page.getByRole('textbox', { name: "Name" }).fill("Tom")
    await expect(page.locator('.col-sm-10', { has: page.getByRole('textbox', { name: "Name" }) }).locator('.glyphicon-remove')).not.toBeVisible()
    await expect(page.locator('.glyphicon-ok')).toBeVisible()

    await page.getByRole('button', { name: 'Open Calendar' }).click()
    await page.getByRole('button', { name: 'Choose month and year' }).click()
    await page.getByRole('button', { name: 'Previous 24 years' }).click()
    await page.getByRole('button', { name: "2014" }).click()
    await page.getByText("MAY").click()
    await page.getByText("2", { exact: true }).click()
    await expect(page.locator('.mat-datepicker-input')).toHaveValue('2014/05/02')

    await page.locator("#type").selectOption("dog")
    await page.getByRole('button', { name: "Save Pet" }).click()

    const newPetSection = page.locator("app-pet-list", { hasText: "Tom" })
    await expect(newPetSection.locator('dt:text-is("Name") + dd')).toHaveText("Tom")
    await expect(newPetSection.locator('dt:text-is("Birth Date") + dd')).toHaveText('2014-05-02')
    await expect(newPetSection.locator('dt:text-is("Type") + dd')).toHaveText('dog')

    await newPetSection.getByRole('button', { name: "Delete Pet" }).click()
    await page.waitForResponse('**/pets/*')
    await expect(newPetSection).not.toBeVisible()

})

test('Select the dates of visits and validate dates order', async ({ page }) => {

    await page.getByRole('link', { name: "Jean Coleman" }).click()
    const samanthaPetSection = page.locator("app-pet-list", { hasText: "Samantha" })
    await samanthaPetSection.getByRole('button', { name: "Add visit" }).click()

    await expect(page.getByRole('heading')).toHaveText("New Visit")
    await expect(page.locator('.table-striped td').first()).toHaveText("Samantha")
    await expect(page.locator('.table-striped td').last()).toHaveText("	Jean Coleman")


    let date = new Date()
    let currentDayForCalendarClick = date.getDate().toString()
    let currentDay = date.toLocaleString('en-US', { day: '2-digit' })
    let currentMonth = date.toLocaleString('en-US', { month: '2-digit' })
    let currentYear = date.getFullYear().toString()
    let expectedFullDate = `${currentYear}/${currentMonth}/${currentDay}`

    await page.getByRole('button', { name: 'Open Calendar' }).click()
    await page.getByText(currentDayForCalendarClick, { exact: true }).click()
    await expect(page.locator('.mat-datepicker-input')).toHaveValue(expectedFullDate)
    await page.locator('#description').fill("dermatologist's visit")
    await page.getByRole('button', { name: "Add Visit" }).click()

    const samanthaVisitTable = samanthaPetSection.locator('app-visit-list')
    await expect(samanthaVisitTable.locator('td').first()).toHaveText(`${currentYear}-${currentMonth}-${currentDay}`)
    await samanthaPetSection.getByRole('button', { name: "Add visit" }).click()
    date.setDate(date.getDate() - 45)
    currentDayForCalendarClick = date.getDate().toString()
    currentDay = date.toLocaleString('en-US', { day: '2-digit' })
    currentMonth = date.toLocaleString('en-US', { month: '2-digit' })
    currentYear = date.getFullYear().toString()

    await page.getByRole('button', { name: 'Open Calendar' }).click()
    let calendarMonthAndYear = await page.getByRole('button', { name: 'Choose month and year' }).textContent()
    const expectedMonthAndYear = `${currentMonth} ${currentYear}`
    while (!calendarMonthAndYear?.includes(expectedMonthAndYear)) {
        await page.getByRole('button', { name: 'Previous month' }).click()
        calendarMonthAndYear = await page.getByRole('button', { name: 'Choose month and year' }).textContent()
    }
    await page.getByText(currentDayForCalendarClick, { exact: true }).click()
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

