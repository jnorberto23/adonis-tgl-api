import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Users', () => {
  // Get requests
  test('GET - should return an error if an invalid token is passed as a parameter', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/users')
      .auth('123', { type: 'bearer' })
      .send()
      .expect(401)
    assert.equal(response.status, 401)
  })

  test('GET - must return all users if a valid token is passed as a parameter', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@gmail.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .get('/users')
      .auth(token, { type: 'bearer' })
      .send()
      .expect(200)
    assert.equal(response.status, 200)
  })

  // SHOW requests
  test('SHOW - must return a user if the requesters id is equal to the id passed as parameter', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@gmail.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .get(`/users/1`)
      .auth(token, { type: 'bearer' })
      .send()
      .expect(200)
    assert.equal(response.status, 200)
    assert.exists(response.body.bets)
  })

  test('SHOW - should return an error if the requesters id is different from the id passed as parameter', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@gmail.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .get(`/users/2`)
      .auth(token, { type: 'bearer' })
      .send()
      .expect(403)
    assert.equal(response.status, 403)
  })
  // STORE requests
  test('STORE - should return an error if any field is empty', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/users')
      .send({
        first_name: 'Rafaela',
        last_name: 'Norberto',
        username: '',
        email: 'rafaela@gmail.com',
        password: '123456',
      })
      .expect(422)
    assert.equal(response.status, 422)
    assert.exists(response.body.errors[0].rule)
    assert.exists(response.body.errors[0].field)
    assert.exists(response.body.errors[0].message)
  })

  test('STORE - must register the user if no field is empty', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/users')
      .send({
        first_name: 'Rafaela',
        last_name: 'Norberto',
        username: 'rafa12',
        email: 'rafaela@gmail.com',
        password: '123456',
      })
      .expect(200)
    assert.equal(response.status, 200)
    assert.exists(response.body.first_name)
    assert.exists(response.body.last_name)
    assert.exists(response.body.email)
    assert.exists(response.body.username)
    assert.exists(response.body.password)
  })
  // UPDATE requests

  test('UPDATE - should return an error if there is an attempt to update from a non-existent user', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@skke.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .put('/users/1')
      .auth(token, { type: 'bearer' })
      .send()
      .expect(401)
    assert.equal(response.status, 401)
    assert.exists(response.body.errors[0].message)
  })

  test('UPDATE - should return an error if the requesting user is different from the target user', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'adonis@gmail.com',
      password: 'adonis',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .put('/users/1')
      .auth(token, { type: 'bearer' })
      .send({
        first_name: 'Adonis Creed',
        last_name: 'Silva Santos',
        username: 'adonisc',
      })
      .expect(403)
    assert.equal(response.status, 403)
    assert.exists(response.body.error.message)
  })

  test('UPDATE - must update the data if the requester id is the same as the target id', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'adonis@gmail.com',
      password: 'adonis',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .put('/users/2')
      .auth(token, { type: 'bearer' })
      .send({
        first_name: 'Adonis Creed',
        last_name: 'Silva Santos',
        username: 'adoniscs',
      })
      .expect(200)
    assert.equal(response.status, 200)
    assert.exists(response.body.first_name)
    assert.exists(response.body.last_name)
    assert.exists(response.body.email)
    assert.exists(response.body.username)
    assert.exists(response.body.password)
  })
  // DESTROY requests
  test('DESTROY - should return an error if the target user does not exist', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'joao@skke.com',
      password: 'root',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .delete('/users/1')
      .auth(token, { type: 'bearer' })
      .expect(401)
    assert.equal(response.status, 401)
    assert.exists(response.body.errors[0].message)
  })

  test('DESTROY - should return an error if the requester id is different from the target id', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'adonis@gmail.com',
      password: 'adonis',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .delete('/users/1')
      .auth(token, { type: 'bearer' })
      .expect(403)
    assert.equal(response.status, 403)
    assert.exists(response.body.error.message)
  })

  test('DESTROY - must delete a user if the requester id is the same as the target', async (assert) => {
    const user = await supertest(BASE_URL).post('/login').send({
      email: 'rafaela@gmail.com',
      password: '123456',
    })
    const token = user.body.token

    const response = await supertest(BASE_URL)
      .delete('/users/3')
      .auth(token, { type: 'bearer' })
      .expect(200)
    assert.equal(response.status, 200)
  })
})
