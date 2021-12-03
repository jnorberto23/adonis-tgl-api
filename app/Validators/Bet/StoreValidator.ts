import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesCustom from '../MessagesCustom'

export default class BetStoreValidator extends MessagesCustom {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    bets: schema.array().members(
      schema.object().members({
        game_id: schema.number([rules.exists({ table: 'games', column: 'id' })]),
        numbers: schema.array([rules.minLength(1), rules.maxLength(50)]).members(schema.number()),
      })
    ),
  })
}
