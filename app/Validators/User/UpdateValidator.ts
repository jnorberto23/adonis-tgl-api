import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    userId: this.ctx.auth.user!.id,
  })

  public schema = schema.create({
    first_name: schema.string({}, [rules.minLength(2)]),
    last_name: schema.string({}, [rules.minLength(2)]),
    username: schema.string.optional({}, [
      rules.unique({
        table: 'users',
        column: 'username',
        whereNot: { id: this.refs.userId },
      }),
    ]),
  })

  public messages = {}
}
