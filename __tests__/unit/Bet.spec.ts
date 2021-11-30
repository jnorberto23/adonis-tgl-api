import Game from 'App/Models/Game'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Bets', () => {
  // STORE requests
  test('STORE: should return an error if the user does not exist', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@skke.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .post('/bets')
      .auth(token, { type: 'bearer' })
      .send()
      .expect(401)
    assert.equal(response.status, 401)
    assert.exists(response.body.errors[0].message)
  })

  test('STORE: must return an error if the total price of the cart is less than R$30', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@gmail.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .post('/bets')
      .auth(token, { type: 'bearer' })
      .send({
        bets: [
          {
            game_id: 2,
            numbers: [1, 2, 3, 4, 6, 60],
          },
          {
            game_id: 2,
            numbers: [1, 2, 3, 4, 5, 9],
          },
        ],
      })
      .expect(403)
    assert.equal(response.status, 403)
    assert.exists(response.body.errors[0].message)
  })

  test('STORE: should return an error if the number of selected numbers of a game is invalid', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@gmail.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .post('/bets')
      .auth(token, { type: 'bearer' })
      .send({
        bets: [
          {
            game_id: 2,
            numbers: [1, 2, 3, 4, 6, 60, 5, 7, 9, 3],
          },
          {
            game_id: 2,
            numbers: [1, 2, 3, 4, 5, 9],
          },
        ],
      })
      .expect(400)
    assert.equal(response.status, 400)
    assert.exists(response.body.errors.message)
    assert.exists(response.body.errors.maxNumbers)
    assert.exists(response.body.errors.selectedNumbers)
  })

  test('STORE: should return an error if the game is out of range', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@gmail.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .post('/bets')
      .auth(token, { type: 'bearer' })
      .send({
        bets: [
          {
            game_id: 2,
            numbers: [1, 2, 3, 4, 5, 999],
          },
          {
            game_id: 2,
            numbers: [1, 2, 3, 4, 5, 9],
          },
        ],
      })
      .expect(400)
    assert.equal(response.status, 400)
    assert.exists(response.body.errors.message)
    assert.exists(response.body.errors.numbersRange)
  })

  test('STORE: must create a bet if the token and fields are valid and the cart price is greater than R$30', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@gmail.com',
      password: 'root',
    })

    const token = user.body.token
    const games = await Game.query()
    const bets: any[] = []

    for (let i = 0; i <= 7; i++) {
      const numbers: any[] = []
      while (numbers.length < games[1].maxNumber) {
        var ramdom = Math.floor(Math.random() * games[1].range)
        if (numbers.indexOf(ramdom) === -1) numbers.push(ramdom)
      }
      bets.push({
        game_id: games[1].id,
        numbers: numbers,
      })
    }

    const response = await supertest(BASE_URL)
      .post('/bets')
      .auth(token, { type: 'bearer' })
      .send({ bets })
      .expect(200)
    assert.equal(response.status, 200)
  })

  // Get requests
  test('GET - should return an error if an invalid token is passed as a parameter', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/bets')
      .auth('123', { type: 'bearer' })
      .send()
      .expect(401)
    assert.equal(response.status, 401)
  })

  test('GET - must return all user bets if token is valid', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@gmail.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .get('/bets')
      .auth(token, { type: 'bearer' })
      .send()
      .expect(200)
    assert.equal(response.status, 200)
  })

  //Show requests
  test('SHOW - should return an error if the id of the requestor is different from the id of the target bet', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'adonis@gmail.com',
      password: 'adonis',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .get('/bets/1')
      .auth(token, { type: 'bearer' })
      .send()
      .expect(403)
    assert.equal(response.status, 403)
    assert.exists(response.body.errors[0].message)
  })

  test('SHOW - should return an error if the token is invalid', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@skkr.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .get('/bets/1')
      .auth(token, { type: 'bearer' })
      .send()
      .expect(401)
    assert.equal(response.status, 401)
    assert.exists(response.body.errors[0].message)
  })

  test('SHOW - must return a bet if the requester id is the same as the target bet id', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@gmail.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .get('/bets/1')
      .auth(token, { type: 'bearer' })
      .send()
      .expect(200)
    assert.equal(response.status, 200)
    assert.exists(response.body[0].numbers)
  })

  // Destroy reqyests
  test('DESTROY: should return an error if the user does not exist', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@skke.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .delete('/bets/1')
      .auth(token, { type: 'bearer' })
      .expect(401)
    assert.equal(response.status, 401)
    assert.exists(response.body.errors[0].message)
  })

  test('DESTROY: should return an error if the requesting user is not the same as the target bet user_id', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'adonis@gmail.com',
      password: 'adonis',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .delete('/bets/1')
      .auth(token, { type: 'bearer' })
      .expect(403)
    assert.equal(response.status, 403)
    assert.exists(response.body.errors[0].message)
  })

  test('DESTROY: should return an error if the target bet does not exist', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@gmail.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .delete('/bets/99')
      .auth(token, { type: 'bearer' })
      .expect(404)
    assert.equal(response.status, 404)
    assert.exists(response.body.errors[0].message)
  })
  test('DESTROY: must delete the bet if the token is valid', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@gmail.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .delete('/bets/1')
      .auth(token, { type: 'bearer' })
      .expect(200)
    assert.equal(response.status, 200)
  })
})
