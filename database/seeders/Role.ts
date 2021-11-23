import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'
export default class UsersRoleSeeder extends BaseSeeder {
  public async run() {
    await Role.createMany([
      {
        type: 'user',
      },
      {
        type: 'admin',
      },
    ])
  }
}
