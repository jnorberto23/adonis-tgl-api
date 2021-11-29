import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Games', () => {
  // Get requests
  test('GET: should return all games', async (assert) => {
    const response = await supertest(BASE_URL).get('/games').expect(200)
    assert.equal(response.status, 200)
    assert.exists(response.body.types[0].type)
  })

  test('GET: should return a specific game', async (assert) => {
    const response = await supertest(BASE_URL).get('/games/1').expect(200)
    assert.equal(response.status, 200)
    assert.exists(response.body.type)
  })

  test('GET: should return a error for a GET request of a non existing game', async (assert) => {
    const response = await supertest(BASE_URL).get('/games/999').expect(404)
    assert.equal(response.status, 404)
    assert.exists(response.body.error.message)
  })

  // STORE requests
  test('STORE: should return error for a post attempt from a non existing user', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@skke.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .post('/games')
      .auth(token, { type: 'bearer' })
      .send()
      .expect(401)
    assert.equal(response.status, 401)
    assert.exists(response.body.errors[0].message)
  })

  test('STORE: should return error for a post attempt from a non admin user', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'adonis@gmail.com',
      password: 'adonis',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .post('/games')
      .auth(token, { type: 'bearer' })
      .send()
      .expect(403)
    assert.equal(response.status, 403)
    assert.exists(response.body.error.message)
  })

  test('STORE: should create the game if all the inputs are filled and the user is admin', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@gmail.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .post('/games')
      .auth(token, { type: 'bearer' })
      .send({
        type: 'Mega da Virada',
        description:
          'Escolha 6 números dos 60 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.',
        range: 60,
        price: 7.5,
        max_number: 6,
        color: '#01ddd66',
      })
      .expect(200)
    assert.equal(response.status, 200)
    assert.exists(response.body.type)
  })

  test('STORE: should return a error if a input field are blank or missing', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@gmail.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .post('/games')
      .auth(token, { type: 'bearer' })
      .send({
        type: '',
        description:
          'Escolha 6 números dos 60 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.',
        range: 60,
        price: 7.5,
        max_number: 6,
        color: '#01ddd66',
      })
      .expect(422)
    assert.equal(response.status, 422)
    assert.exists(response.body.errors[0].rule)
    assert.exists(response.body.errors[0].field)
    assert.exists(response.body.errors[0].message)
  })

  // UPDATE requests

  test('UPDATE: should return error for a UPDATE attempt from a non existing user', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@skke.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .put('/games/1')
      .auth(token, { type: 'bearer' })
      .send()
      .expect(401)
    assert.equal(response.status, 401)
    assert.exists(response.body.errors[0].message)
  })

  test('UPDATE: should return error for a UPDATE attempt from a non admin user', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'adonis@gmail.com',
      password: 'adonis',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .put('/games/1')
      .auth(token, { type: 'bearer' })
      .send()
      .expect(403)
    assert.equal(response.status, 403)
    assert.exists(response.body.error.message)
  })

  test('UPDATE: should return error for a UPDATE attempt from a non existing GAME', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@gmail.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .put('/games/99')
      .auth(token, { type: 'bearer' })
      .send({
        type: 'jogo do bicho',
        description:
          'Escolha 6 números dos 60 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.',
        range: 100,
        price: 9,
        max_number: 8,
        color: '#01ddd66',
      })
      .expect(404)
    assert.equal(response.status, 404)
    assert.exists(response.body.error.message)
  })

  test('UPDATE: should UPDATE the game if all the inputs are filled and the user is admin', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@gmail.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .put('/games/1')
      .auth(token, { type: 'bearer' })
      .send({
        type: 'jogo do bicho',
        description:
          'Escolha 6 números dos 60 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.',
        range: 100,
        price: 9,
        max_number: 8,
        color: '#01ddd66',
      })
      .expect(200)
    assert.equal(response.status, 200)
    assert.exists(response.body.type)
  })

  // DESTROY requests

  test('DESTROY: should return error for a DESTROY attempt from a non existing user', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@skke.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .delete('/games/1')
      .auth(token, { type: 'bearer' })
      .expect(401)
    assert.equal(response.status, 401)
    assert.exists(response.body.errors[0].message)
  })

  test('DESTROY: should return error for a DESTROY attempt from a non admin user', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'adonis@gmail.com',
      password: 'adonis',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .delete('/games/1')
      .auth(token, { type: 'bearer' })
      .expect(403)
    assert.equal(response.status, 403)
    assert.exists(response.body.error.message)
  })

  test('DESTROY: should return error for a DESTROY attempt from a non existing GAME', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@gmail.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .delete('/games/99')
      .auth(token, { type: 'bearer' })
      .expect(404)
    assert.equal(response.status, 404)
    assert.exists(response.body.error.message)
  })

  test('DESTROY: should DESTROY the game if the user is admin', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@gmail.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .delete('/games/1')
      .auth(token, { type: 'bearer' })
      .expect(200)
    assert.equal(response.status, 200)
  })
})
