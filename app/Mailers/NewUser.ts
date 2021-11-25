import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

export default class ForgotPasswordMailer extends BaseMailer {
  constructor(private user) {
    super()
  }

  public prepare(message: MessageContract) {
    message
      .from('contato@tgl.com')
      .to(this.user.email)
      .subject('Boas Vindas')
      .htmlView('emails/new_user', {
        name: this.user.firstName,
      })
      .textView('emails/new_user-text', {
        name: this.user.firstName,
      })
  }
}
