import vine from '@vinejs/vine'

export const contributionValidator = vine.create({
    member_id: vine.number(),
    amount: vine.number(),
    notes: vine.string().optional(),
    contribution_month: vine.string(),
})