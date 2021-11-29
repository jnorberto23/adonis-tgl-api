import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'
import Cart from 'App/Models/Cart'
import gameValidator from 'App/Validators/Game/GameValidator'

export default class GamesController {
  public async index({ response }: HttpContextContract) {
    try {
      const game = await Game.query()
      const cart = await Cart.query().where({ status: true })

      return {
        'min-cart-value': cart[0].value,
        'types': game,
      }
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu errado ao buscar os jogos' } })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    await request.validate(gameValidator)
    const data = request.all()
    const game = await Game.create(data)
    return game
  }

  public async show({ params, response }: HttpContextContract) {
    const game = await Game.find(params.id)
    if (!game) {
      return response.notFound({ error: { message: 'Oops, esse jogo não existe ou foi apagado' } })
    }
    return game
  }

  public async update({ params, request, response }: HttpContextContract) {
    await request.validate(gameValidator)
    const game = await Game.find(params.id)
    if (!game) {
      return response.notFound({ error: { message: 'Oops, esse jogo não existe ou foi apagado' } })
    }
    const data = request.only(['type', 'description', 'range', 'price', 'max_number', 'color'])
    game.merge(data)
    await game.save()
    return game
  }

  public async destroy({ params, response }: HttpContextContract) {
    const game = await Game.find(params.id)
    if (!game) {
      return response.notFound({
        error: { message: 'Oops, esse jogo não existe ou já foi apagado' },
      })
    }
    await game.delete()
  }
}
