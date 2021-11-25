import { BaseTask } from 'adonis5-scheduler/build'
import Bet from 'App/Models/Bet'
import User from 'App/Models/User'
import moment from 'moment'
import CallToBetMailer from 'App/Mailers/CallToBet'

export default class CallToBet extends BaseTask {
  public static get schedule() {
    return '1 * * * * *'
  }
  public static get useLock() {
    return false
  }

  public async handle() {
    const sevenDaysAgo = moment().subtract('7', 'days').format('YYYY-MM-DD')

    const bets = await Bet.query()
      .where('created_at', '>', sevenDaysAgo.toString())
      .orderBy('created_at', 'desc')
      .preload('user', (user): void => {
        user.select('first_name')
      })

    const usersWithBetsOnPastSevenDays: number[] = []
    bets.map((bet) => {
      if (!usersWithBetsOnPastSevenDays.includes(bet.user.id)) {
        usersWithBetsOnPastSevenDays.push(bet.user.id)
      }
    })

    const users: number[] = await User.query()
    const usersSanitized: any[] = []
    users.map((user: any) =>
      usersSanitized.push({ id: user.id, email: user.email, first_name: user.firstName })
    )

    usersWithBetsOnPastSevenDays.filter((id: number) => {
      Object.entries(usersSanitized).map(([key, value]) => {
        if (value.id === id) {
          usersSanitized.splice(Number(key), 1)
          console.log(usersSanitized)
        }
      })
    })

    usersSanitized.forEach(async (user) => {
      await new CallToBetMailer(user).sendLater()
      console.log(`-> email to ${user.email} sent`)
    })

    return
  }
}
