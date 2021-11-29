import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Authentication', () => {
  test('should login a user with correctly password and email and return a token', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: 'joao@gmail.com',
        password: 'root',
      })
      .expect(200)
    assert.equal(response.status, 200)
    assert.exists(response.body.token)
  })

  test('should return a error to user for wrong password', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: 'joao@gmail.com',
        password: 'rootaaa',
      })
      .expect(400)
    assert.equal(response.status, 400)
    assert.exists(response.body.errors[0].message)
  })

  test('should return a error to user for wrong email', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: 'joao@skke.com',
        password: 'root',
      })
      .expect(422)
    assert.equal(response.status, 422)
    assert.exists(response.body.errors[0].rule)
    assert.exists(response.body.errors[0].field)
    assert.exists(response.body.errors[0].message)
  })
})
