import { test as base } from '@playwright/test'
import { faker } from '@faker-js/faker'


export type TestOptions = {
    ownersPage: string
    testData: {
        ownerName: string
        petName: string
        visitDescription: string
    }
}

export const test = base.extend<TestOptions>({

 
    testData: async ({ request }, use) => {


        const ownerFirstName = faker.person.firstName()
        const ownerLastName = faker.person.lastName()
        const address = faker.location.streetAddress()
        const city = faker.location.city()
        const phone = `608555${faker.string.numeric(4)}`
        const newOwnerResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/owners', {
            data: { "id": null, "firstName": ownerFirstName, "lastName": ownerLastName, "address": address, "city": city, "telephone": phone }
        })
        const newOwnerBody = await newOwnerResponse.json()
        const newOwnerID = newOwnerBody.id
        const ownerName = `${ownerFirstName} ${ownerLastName}`

        const petName = faker.person.firstName()
        const birthDate = faker.date.past().toISOString().slice(0, 10)
        const newPetResponse = await request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${newOwnerID}/pets`, {
            data: {
                "id": null, "owner": newOwnerBody, "name": petName, "birthDate": birthDate, "pettype": "lizard", "type": { "name": "lizard", "id": 3075 }
            }
        })

        const newPetBody = await newPetResponse.json()
        const newPetID = newPetBody.id

        const visitDate = faker.date.future().toISOString().slice(0, 10)
        const visitDescription = "API visit"
        await request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${newOwnerID}/pets/${newPetID}/visits`, {
            data: { "date": visitDate, "description": visitDescription, "id": null, "pet": newPetBody }
        })

        await use({
            ownerName,
            petName,
            visitDescription
        })

        await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${newOwnerID}`)


    }, 

       ownersPage: async ({ page, testData }, use) => {

        await page.goto("/")
        await page.getByRole("button", { name: "Owners" }).click();
        await page.getByRole("link", { name: "Search" }).click();
        await use('')
    }



})