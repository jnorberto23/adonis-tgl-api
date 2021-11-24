import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import authValidator from 'App/Validators/Auth/AuthValidator'

export default class AuthController {
  public async login({ request, auth, response }: HttpContextContract) {
    try {
      await request.validate(authValidator)
      const { email, password } = request.all()
      const token = await auth.attempt(email, password)
      return token
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu errado, tente novamente mais tarde' } })
    }
  }
}
