import User from 'App/Models/User'

const AdminsList = async () => {
  let users = await User.query().preload('usersRoles', (usersRoles) => {
    usersRoles.where({ roleId: 2 })
  })

  let list = users.filter((user) => user.usersRoles.length)

  return list
}

export default AdminsList
