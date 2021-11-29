import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
export default class UsersRoleSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        firstName: 'Joao',
        lastName: 'Norberto',
        username: 'joaonorberto1',
        email: 'joao@gmail.com',
        password: 'root',
      },
      {
        firstName: 'Adonis',
        lastName: 'Silva',
        username: 'adonis1',
        email: 'adonis@gmail.com',
        password: 'adonis',
      },
    ])
  }
}
