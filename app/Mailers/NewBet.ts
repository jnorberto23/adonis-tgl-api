import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Producer from 'App/Services/Kafka/Producer'
export default class ForgotPasswordMailer extends BaseMailer {
  constructor(private user, private bets: [], private cartPrice) {
    super()
  }

  public async prepare(message: MessageContract) {
    const producer = new Producer()
    producer.produce({
      topic: 'newBets',
      messages: [{ value: 'Hello mano, saiu aqui do adonis!' }],
    })
    /*
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
      */
  }
}
