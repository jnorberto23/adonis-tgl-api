import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Bets extends BaseSchema {
  protected tableName = 'bets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onUpdate('CASCADE') // Se o usuario for apagado, a aposta devera ser apagada tambem?
      table.integer('game_id').unsigned().references('id').inTable('users').onUpdate('CASCADE')
      table.string('numbers').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
