import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

export default class ForgotPasswordMailer extends BaseMailer {
  constructor(private user, private url) {
    super()
  }

  public prepare(message: MessageContract) {
    message
      .from('contato@tgl.com')
      .to(this.user.email)
      .subject('Redefinição de senha')
      .htmlView('emails/forgot_password', {
        email: this.user.email,
        token: this.user.token,
        url: this.url,
      })
  }
}
