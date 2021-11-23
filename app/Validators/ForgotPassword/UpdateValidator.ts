import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    token: schema.string({}, [rules.exists({ table: 'users', column: 'token' })]),
    password: schema.string({}, [rules.confirmed()]),
  })

  public messages = {}
}
