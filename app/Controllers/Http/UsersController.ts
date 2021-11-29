import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Bet from 'App/Models/Bet'
import UsersRole from 'App/Models/UsersRoles'
import NewUserMailer from 'App/Mailers/NewUser'
import storeValidator from 'App/Validators/User/StoreValidator'
import updateValidator from 'App/Validators/User/UpdateValidator'
import moment from 'moment'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    try {
      const user = await User.query().select('id', 'first_name', 'last_name', 'username', 'email')
      return user
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu errado ao listar os usuários' } })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    await request.validate(storeValidator)
    try {
      const data = request.all()
      const user = await User.create(data)
      await UsersRole.create({ userId: user.id, roleId: 1 })
      await new NewUserMailer(user).sendLater()
      return user
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu errado ao criar o seu usuário' } })
    }
  }

  public async show({ params, auth, response }: HttpContextContract) {
    try {
      auth.user?.id !== params.id &&
        response.forbidden({
          error: { message: 'Oops, você não tem permissão para realizar essa operacação.' },
        })
      const user: User | undefined = auth.user
      const oneMonthAgo = moment().subtract('30', 'days').format('YYYY-MM-DD')
      const bets = await Bet.query()
        .select('id', 'numbers', 'game_id', 'user_id', 'createdAt')
        .where({ userId: user?.id })
        .where('created_at', '>', oneMonthAgo.toString())
        .preload('game', (game): void => {
          game.select('type', 'price')
        })
      return { user, bets }
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu ao buscar os seus dados' } })
    }
  }

  public async update({ params, auth, request, response }: HttpContextContract) {
    await request.validate(updateValidator)
    try {
      auth.user?.id !== params.id &&
      response.forbidden({
        error: { message: 'Oops, você não tem permissão para realizar essa operacação.' },
      })
      const user = await User.findOrFail(params.id)
      const data = request.only(['first_name', 'last_name', 'username'])
      user.merge(data)
      await user.save()
      return user
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu errado ao atualizar os seus dados' } })
    }
  }

  public async destroy({ params, auth, response }: HttpContextContract) {
    auth.user?.id !== params.id &&
    response.status(403).send({
      error: { message: 'Oops, você não tem permissão para realizar essa operacação.' },
    })
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu errado ao apagar o seu usuario' } })
    }
  }
}
