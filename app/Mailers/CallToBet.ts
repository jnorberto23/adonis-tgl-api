import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

export default class ForgotPasswordMailer extends BaseMailer {
  constructor(private user) {
    super()
  }

  public prepare(message: MessageContract) {
    message
      .from('contato@tgl.com')
      .to(this.user.email)
      .subject('Sentimos a sua falta')
      .htmlView('emails/call_to_bet', {
        name: this.user.first_name,
      })
  }
}
