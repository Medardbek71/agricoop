import { ContributionSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Member from './member.ts'

export default class Contribution extends ContributionSchema {
    @belongsTo(()=>Member)
    declare member: BelongsTo<typeof Member>
}
