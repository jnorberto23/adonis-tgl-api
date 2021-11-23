import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UsersRole from 'App/Models/UsersRoles'
import storeValidator from 'App/Validators/User/StoreValidator'
import updateValidator from 'App/Validators/User/UpdateValidator'

export default class UsersController {
  public async index({}: HttpContextContract) {
    const user = await User.query()
    return user
  }

  public async store({ request }: HttpContextContract) {
    await request.validate(storeValidator)
    const data = request.all()
    const user = await User.create(data)
    return user
  }

  public async show({ params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    return user
  }

  public async update({ params, request }: HttpContextContract) {
    await request.validate(updateValidator)
    const user = await User.findOrFail(params.id)
    const data = request.only(['first_name', 'last_name', 'username'])
    user.merge(data)
    await user.save()
    return user
  }

  public async destroy({ params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    await user.delete()
  }
}
