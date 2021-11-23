import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import ForgotPasswordMailer from 'App/Mailers/ForgotPassword'
import storeVallidator from 'App/Validators/ForgotPassword/StoreValidator'
import updateValidator from 'App/Validators/ForgotPassword/UpdateValidator'
import crypto from 'crypto'
import moment from 'moment'

export default class ForgotPasswordsController {
  public async store({ request, response }: HttpContextContract) {
    await request.validate(storeVallidator)
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)
      user.token = crypto.randomBytes(10).toString('hex')
      user.tokenCreatedAt = new Date()
      await user.save()
      const link = `${request.input('redirect_url')}?token=${user.token}`
      await new ForgotPasswordMailer(user, link).sendLater()
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Algo não deu certo, esse e-mail existe?' } })
    }
  }

  public async update({ request, response }) {
    await request.validate(updateValidator)
    try {
      const { token, password } = request.all()
      const user = await User.findByOrFail('token', token)

      const tokenExpired = moment().subtract('2', 'days').isAfter(user.tokenCreatedAt)

      if (tokenExpired) {
        return response.status(401).send({
          error: {
            message: 'Ops, o token de recupeção está expirado, pois já se passaram 48 horas.',
          },
        })
      }

      user.token = null as any
      user.tokenCreatedAt = null as any
      user.password = password

      await user.save()
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Ops, algo deu errado ao tentar resetar sua senha :(' } })
    }
  }
}
