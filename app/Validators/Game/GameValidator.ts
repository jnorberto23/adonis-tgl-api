import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesCustom from '../MessagesCustom'

export default class GameValidator extends MessagesCustom {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    type: schema.string({}, [rules.minLength(2)]),
    description: schema.string({}, [rules.minLength(2)]),
    range: schema.number([rules.required()]),
    price: schema.number([rules.required()]),
    max_number: schema.number([rules.required()]),
    color: schema.string({}, [rules.minLength(6)]),
  })
}
