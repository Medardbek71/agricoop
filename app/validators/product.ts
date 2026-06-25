 import vine from '@vinejs/vine'

export const productValidator = vine.compile(
  vine.object({
    owner_id: vine.number(),
    name: vine.string().trim().minLength(2),
    quantity: vine.number().min(0),
    price: vine.number().min(100),
    alert_stock: vine.number().min(0)
  })
)