import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Game from 'App/Models/Game'

export default class Bet extends BaseModel {
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Game)
  public game: BelongsTo<typeof Game>

  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public gameId: number

  @column()
  public numbers: string
}
