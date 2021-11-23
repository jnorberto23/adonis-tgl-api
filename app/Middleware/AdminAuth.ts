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
      : response.status(401).send({
          errors: [
            {
              message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access',
            },
          ],
        })
  }
}
