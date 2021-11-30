import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Games', () => {
  // Get requests
  test('GET: must return all games', async (assert) => {
    const response = await supertest(BASE_URL).get('/games').expect(200)
    assert.equal(response.status, 200)
    assert.exists(response.body.types[0].type)
  })

  test('SHOW: must return a specific game', async (assert) => {
    const response = await supertest(BASE_URL).get('/games/1').expect(200)
    assert.equal(response.status, 200)
    assert.exists(response.body.type)
  })

  test('SHOW: should return an error if the game doesnt exist', async (assert) => {
    const response = await supertest(BASE_URL).get('/games/999').expect(404)
    assert.equal(response.status, 404)
    assert.exists(response.body.error.message)
  })

  // STORE requests
  test('STORE: should return an error if the user does not exist', async (assert) => {
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

  test('STORE: should return an error if the requesting user is not an admin', async (assert) => {
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

  test('STORE: must create a game if all fields are filled and the requester is admin', async (assert) => {
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

  test('STORE: should return an error if any field is empty', async (assert) => {
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

  test('UPDATE: should return an error if the user does not exist', async (assert) => {
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

  test('UPDATE: should return an error if the requesting user is not an admin', async (assert) => {
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

  test('UPDATE: should return an error if the target game does not exist', async (assert) => {
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

  test('UPDATE: must update a game if the fields are filled and the requester is an admin', async (assert) => {
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

  test('DESTROY: should return an error if the user does not exist', async (assert) => {
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

  test('DESTROY: should return an error if the requesting user is not an admin', async (assert) => {
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

  test('DESTROY: should return an error if the target game does not exist', async (assert) => {
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

  test('DESTROY: must delete the target game if the requester is admin', async (assert) => {
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
