import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Game from 'App/Models/Game'

export default class ForgotPasswordMailer extends BaseMailer {
  constructor(private user, private bets: [], private cartPrice) {
    super()
  }

  public async prepare(message: MessageContract) {
    message
      .from('contato@tgl.com')
      .to(this.user.email)
      .subject('Resumo das apostas')
      .htmlView('emails/new_bet', {
        name: this.user.firstName,
        bets: this.bets,
        cartPrice: this.cartPrice,
      })
      .textView('emails/new_bet-text', {
        name: this.user.first_name,
      })
  }
}
