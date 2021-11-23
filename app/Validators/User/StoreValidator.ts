import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    first_name: schema.string({}, [rules.minLength(2)]),
    last_name: schema.string({}, [rules.minLength(2)]),
    username: schema.string({}, [rules.unique({ table: 'users', column: 'username' })]),
    email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    password: schema.string({}, [rules.minLength(6)]),
  })

  public messages = {}
}
