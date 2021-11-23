import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Role from 'App/Models/Role'

export default class UsersRole extends BaseModel {
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public roleId: number
}
