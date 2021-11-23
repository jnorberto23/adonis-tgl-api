import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import storeValidator from 'App/Validators/Bet/StoreValidator'
import updateValidator from 'App/Validators/Bet/UpdateValidator'

export default class BetsController {
  public async index({}: HttpContextContract) {
    const bet = await Bet.query().preload('user').preload('game')
    return bet
  }

  public async store({ request, response }: HttpContextContract) {
    await request.validate(storeValidator)
    const data = request.all()
    const userId = data.user_id
    let bets = data.bets

    const checkEachBetPriceAndInsertUserId = async () => {
      var prices: number = 0
      for (const bet in bets) {
        bets[bet].user_id = userId
        const game = await Game.findOrFail(bets[bet].game_id)
        prices += game.price
      }
      return prices
    }
    const cartPrice = await checkEachBetPriceAndInsertUserId()

    if (cartPrice > 30) {
      const bet = await Bet.createMany(bets)
      return bet
    } else {
      return response.status(403)
    }
  }

  public async show({ params }: HttpContextContract) {
    const bet = await Bet.findOrFail(params.id)
    await bet.load('user')
    await bet.load('game')
    return bet
  }

  // Apenas o Admin pode realizar a alteracao

  public async update({ params, request }: HttpContextContract) {
    await request.validate(updateValidator)
    const bet = await Bet.findOrFail(params.id)
    const data = request.only(['user_id', 'game_id', 'numbers'])
    bet.merge(data)
    await bet.save()
    return bet
  }

  public async destroy({ params }: HttpContextContract) {
    const bet = await Bet.findOrFail(params.id)
    await bet.delete()
  }
}
