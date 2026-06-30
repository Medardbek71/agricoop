import { MemberSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Contribution from './contribution.ts'

export default class Member extends MemberSchema {
    @hasMany(()=>Contribution)
    declare contribution: HasMany<typeof Contribution>
}