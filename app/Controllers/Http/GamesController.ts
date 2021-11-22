import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'

export default class GamesController {
  public async index({}: HttpContextContract) {
    const game = await Game.query()
    return game
  }

  public async store({ request }: HttpContextContract) {
    const data = request.all()
    const game = await Game.create(data)
    return game
  }

  public async show({ params }: HttpContextContract) {
    const game = await Game.findOrFail(params.id)
    return game
  }

  public async update({ params, request }: HttpContextContract) {
    const game = await Game.findOrFail(params.id)
    const data = request.only(['type', 'description', 'range', 'price', 'max_number', 'color'])
    game.merge(data)
    await game.save()
    return game
  }

  public async destroy({ params }: HttpContextContract) {
    const game = await Game.findOrFail(params.id)
    await game.delete()
  }
}
