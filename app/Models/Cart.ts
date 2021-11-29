import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo} from '@ioc:Adonis/Lucid/Orm'
import Game from 'App/Models/Game'

export default class Cart extends BaseModel {
  @belongsTo(() => Game)
  public game: BelongsTo<typeof Game>

  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string

  @column()
  public value: number

  @column()
  public status: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
