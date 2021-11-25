import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'
import gameValidator from 'App/Validators/Game/GameValidator'

export default class GamesController {
  public async index({ response }: HttpContextContract) {
    try {
      const game = await Game.query()
      return game
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu errado ao atualizar o jogo' } })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      await request.validate(gameValidator)
      const data = request.all()
      const game = await Game.create(data)
      return game
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu errado ao atualizar o jogo' } })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const game = await Game.findOrFail(params.id)
      return game
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu errado ao atualizar o jogo' } })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      await request.validate(gameValidator)
      const game = await Game.findOrFail(params.id)
      const data = request.only(['type', 'description', 'range', 'price', 'max_number', 'color'])
      game.merge(data)
      await game.save()
      return game
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu errado ao atualizar o jogo' } })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const game = await Game.findOrFail(params.id)
      await game.delete()
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu errado ao atualizar o jogo' } })
    }
  }
}
