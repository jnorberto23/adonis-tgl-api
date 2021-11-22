import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import Bet from 'App/Models/Bet'
import { BaseModel, beforeSave, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(() => Bet)
  public bet: HasMany<typeof Bet>

  @column({ isPrimary: true })
  public id: number

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public username: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public token: string

  @column.dateTime({})
  public tokenCreatedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
