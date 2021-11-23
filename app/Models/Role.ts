import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import usersRoles from 'App/Models/UsersRoles'

export default class Role extends BaseModel {
  @hasMany(() => usersRoles)
  public usersRoles: HasMany<typeof usersRoles>

  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
