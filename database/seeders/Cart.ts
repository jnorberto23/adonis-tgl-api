import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Cart from 'App/Models/Cart'
export default class UsersRoleSeeder extends BaseSeeder {
  public async run() {
    await Cart.createMany([
      {
        value: 30,
        type: 'normal',
      },
      {
        value: 15,
        type: 'promo',
      },
    ])
  }
}
