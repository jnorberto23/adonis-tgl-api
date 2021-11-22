/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.where('id', {
  match: /^[0-9]+$/,
  cast: (id) => Number(id),
})

/*
Route.post('/login', 'AuthController.login')

Route.group(() => {
  Route.group(() => {
    Route.resource('users', 'UsersController').except(['store']).apiOnly()
  }).middleware('auth')
  Route.post('/users', 'UsersController.store')
})

*/

Route.group(() => {
  Route.post('/login', 'AuthController.login')
  Route.resource('users', 'UsersController').apiOnly()
  Route.resource('games', 'GamesController').apiOnly()

  Route.group(() => {
    Route.resource('bets', 'BetsController').apiOnly()
  }).middleware('auth')

  Route.post('passwords', 'ForgotPasswordsController.store')
  Route.put('passwords', 'ForgotPasswordsController.update')
})
