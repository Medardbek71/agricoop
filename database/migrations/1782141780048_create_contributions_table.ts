import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contributions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('member_id').references('member')
      table.integer('amount')
      table.string('reason')
      table.boolean('isComplete')
      table.integer('rest').nullable()
      table.string('contribution_month').nullable()
      table.string('note').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}