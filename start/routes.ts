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

Route.group(() => {
  //Login
  Route.post('/login', 'AuthController.login')

  //Users
  Route.post('/users', 'UsersController.store')
  Route.group(() => {
    Route.resource('users', 'UsersController').except(['create', 'edit', 'store'])
  }).middleware('auth')

  //Bets
  Route.group(() => {
    Route.resource('bets', 'BetsController').except(['create', 'edit', 'update'])
  }).middleware('auth')

  //Games
  Route.get('/games', 'GamesController.index')
  Route.get('/games/:id', 'GamesController.show')
  Route.group(() => {
    Route.resource('games', 'GamesController').except(['create', 'edit', 'index', 'show'])
  }).middleware(['auth', 'adminAuth'])

  //Password Recovery
  Route.post('passwords', 'ForgotPasswordsController.store')
  Route.put('passwords', 'ForgotPasswordsController.update')
})
