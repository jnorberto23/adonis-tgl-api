import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import storeValidator from 'App/Validators/Bet/StoreValidator'
import updateValidator from 'App/Validators/Bet/UpdateValidator'
import NewBetMailer from 'App/Mailers/NewBet'

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
      let cartPrice: number = 0

      for (const i in bets) {
        const game = await Game.findOrFail(bets[i].game_id)
        const numbersCount = bets[i].numbers.length
        const numberOutOfRange = bets[i].numbers.some((value: number) => value > game.range)
        bets[i].user_id = userId
        bets[i].type = game.type
        bets[i].price = game.price
        bets[i].numbers = bets[i].numbers.join('-')
        cartPrice += game.price

        if (game.maxNumber !== numbersCount) {
          return response.badRequest({
            errors: {
              message: `A Aposta para o jogo #${game.id} ${game.type} (${bets[i].numbers}) é invalida.`,
              maxNumbers: game.maxNumber,
              selectedNumbers: numbersCount,
            },
          })
        }
        if (numberOutOfRange) {
          return response.badRequest({
            errors: {
              message: `A Aposta para o jogo #${game.id} ${game.type} (${bets[i].numbers}) é invalida.`,
              numbersRange: game.range,
            },
          })
        }
      }
      if (cartPrice > 30) {
        const betsListToCreate = bets.map(({ type, price, ...item }) => item)
        await Bet.createMany(betsListToCreate)
        await new NewBetMailer(auth.user, bets, cartPrice).sendLater()
      } else {
        response.forbidden({
          errors: [{ message: 'O preço mínimo para salvar um carrinho é de R$ 30,00' }],
        })
      }
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
  // Arrumar
  public async update({ params, auth, request, response }: HttpContextContract) {
    await request.validate(updateValidator)
    const userId: number | undefined = auth.user?.id
    const numbers = request.input('numbers')
    const bet = await Bet.findOrFail(params?.id)
    const game = await Game.findOrFail(bet.gameId)

    if (game.maxNumber !== numbers.length) {
      return response.badRequest({
        errors: {
          message: `Não foi possivel refazer a sua aposta`,
          maxNumbers: game.maxNumber,
          selectedNumbers: numbers.length,
        },
      })
    }

    bet.merge({ numbers: numbers.join('-') })
    return userId === bet.userId
      ? await bet.save()
      : response.unauthorized({ errors: [{ message: 'Essa aposta pertence a outro usuario' }] })
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
