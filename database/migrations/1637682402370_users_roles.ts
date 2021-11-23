import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersRoles extends BaseSchema {
  protected tableName = 'users_roles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onUpdate('CASCADE') // Se o usuario for apagado, a aposta devera ser apagada tambem?
      table.integer('role_id').unsigned().references('id').inTable('roles').onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
