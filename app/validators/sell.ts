import vine from '@vinejs/vine'

export const sellValidator = vine.create({
    product_id: vine.number(),
    quantity: vine.number()
})