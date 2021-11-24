import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import storeValidator from 'App/Validators/Bet/StoreValidator'
import updateValidator from 'App/Validators/Bet/UpdateValidator'

export default class BetsController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const userId: number | undefined = auth.user?.id
      const bet = await Bet.query()
        .select('id', 'numbers', 'game_id', 'user_id', 'createdAt')
        .where({ userId: userId })
        .preload('game', (game): void => {
          game.select('type', 'price')
        })

      return bet.length
        ? bet
        : response.notFound({ errors: [{ message: 'Nenhuma aposta encontrada' }] })
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu errado ao exibir as suas apostas' } })
    }
  }

  public async store({ request, auth, response }: HttpContextContract) {
    await request.validate(storeValidator)
    try {
      const userId: number | undefined = auth.user?.id
      let bets = request.input('bets')

      const checkEachBetPriceAndInsertUserId = async () => {
        var prices: number = 0
        for (const i in bets) {
          bets[i].user_id = userId
          const game = await Game.findOrFail(bets[i].game_id)
          prices += game.price
        }
        return prices
      }
      const cartPrice = await checkEachBetPriceAndInsertUserId()

      cartPrice > 30
        ? await Bet.createMany(bets)
        : response.forbidden({
            errors: [{ message: 'O preço mínimo para salvar um carrinho é de R$ 30,00' }],
          })
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu errado ao salvar o seu carrinho' } })
    }
  }

  public async show({ params, auth, response }: HttpContextContract) {
    try {
      const userId: number | undefined = auth.user?.id

      const bet = await Bet.query()
        .select('numbers', 'game_id', 'user_id', 'createdAt')
        .where({ id: params?.id })
        .preload('game', (game): void => {
          game.select('type', 'price')
        })

      if (bet.length) {
        return userId === bet[0].userId
          ? bet
          : response.unauthorized({ errors: [{ message: 'Essa aposta pertence a outro usuario' }] })
      } else {
        response.notFound({ errors: [{ message: 'Esse aposta não existe ou foi apagada' }] })
      }
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu errado ao buscar a sua aposta' } })
    }
  }
  // Apenas o Admin pode realizar a alteracao

  public async update({ params, auth, request, response }: HttpContextContract) {
    try {
      await request.validate(updateValidator)
      const userId: number | undefined = auth.user?.id
      const bet = await Bet.findOrFail(params.id)
      const data = request.only(['game_id', 'numbers'])
      bet.merge(data)
      return userId === bet.userId
        ? await bet.save()
        : response.unauthorized({ errors: [{ message: 'Essa aposta pertence a outro usuario' }] })
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu errado ao salvar a sua aposta' } })
    }
  }

  public async destroy({ params, auth, response }: HttpContextContract) {
    try {
      const userId: number | undefined = auth.user?.id
      const bet = await Bet.findBy('id', params.id)
      if (bet) {
        return userId === bet.userId
          ? await bet.delete()
          : response.unauthorized({ errors: [{ message: 'Essa aposta pertence a outro usuario' }] })
      } else {
        response.notFound({ errors: [{ message: 'Esse aposta não existe ou foi apagada' }] })
      }
    } catch (err) {
      response
        .status(err.status)
        .send({ error: { message: 'Oops, algo deu errado ao apagar a sua aposta' } })
    }
  }
}
