import vine from '@vinejs/vine'

export const updateProductValidator = vine.create({
    price: vine.number().min(0),
    name: vine.string(),
    stock_qty: vine.number().min(0),
    stock_operation: vine.enum(['add', 'remove']),

})