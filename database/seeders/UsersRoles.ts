import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UsersRoles from 'App/Models/UsersRoles'
export default class UsersRoleSeeder extends BaseSeeder {
  public async run() {
    await UsersRoles.createMany([
      {
        userId: 1,
        roleId: 2,
      },
    ])
  }
}
