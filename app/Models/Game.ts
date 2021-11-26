import { DateTime } from 'luxon'
import Bet from 'App/Models/Bet'
import Cart from 'App/Models/Cart'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

export default class Game extends BaseModel {
  @belongsTo(() => Bet)
  public bet: BelongsTo<typeof Bet>

  @belongsTo(() => Cart)
  public cart: BelongsTo<typeof Cart>

  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string

  @column()
  public description: string

  @column()
  public range: number

  @column()
  public price: number

  @column()
  public maxNumber: number

  @column()
  public color: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
