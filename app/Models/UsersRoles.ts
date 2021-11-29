import { BaseModel, column, hasOne, HasOne} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Role from 'App/Models/Role'

export default class UsersRole extends BaseModel {
  @hasOne(() => User)
  public user: HasOne<typeof User>

  @hasOne(() => Role)
  public role: HasOne<typeof Role>

  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public roleId: number
}
