import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersRoles from 'App/Models/UsersRoles'
import Roles from 'App/Models/Role'

export default class AdminAuth {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    const id = auth.user?.id
    const { roleId } = await UsersRoles.findByOrFail('user_id', id)
    const { type } = await Roles.findByOrFail('id', roleId)
    type === 'admin'
      ? await next()
      : response.status(403).send({
          error: { message: 'Oops, você não tem permissão para realizar essa operacação.' },
        })
  }
}
