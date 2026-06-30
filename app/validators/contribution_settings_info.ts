import vine from '@vinejs/vine'

export const contributionInfoValidator = vine.create({
    monthly_contribution_amount: vine.number(),
    adhesion_fee_amount: vine.number(),
    payment_limit_day: vine.number()
})