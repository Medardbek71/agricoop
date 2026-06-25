import vine from '@vinejs/vine'
import { phoneRule } from '@julienbenac/vine-plugin-phone'

    export const memberValidator = vine.create({
    first_name:vine.string(),
    last_name:vine.string(),
    phone: vine.string().use(phoneRule({ countryCode: 'CM' })),
})

