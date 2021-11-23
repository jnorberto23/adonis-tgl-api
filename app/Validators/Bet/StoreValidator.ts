import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    user_id: schema.number([rules.exists({ table: 'users', column: 'id' })]),
    bets: schema.array().members(
      schema.object().members({
        game_id: schema.number([rules.exists({ table: 'games', column: 'id' })]),
        numbers: schema.string({}, [rules.minLength(1)]),
      })
    ),
  })

  public messages = {}
}