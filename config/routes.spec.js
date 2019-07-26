const request = require('supertest');

const server = require('../api/server');

const db = require('../database/dbConfig');

describe('server', () => {
  
  it('db environment set to testing', () => {
    expect(process.env.DB_ENV).toBe('testing');
  });

  describe('POST /api/register', () => {
    let passwordHash;
    it('should return 201 Created', async () => {
      await db('users').truncate();
      const user = { username: 'bob', password: '1234' };
      const response = await request(server).post('/api/register').send(user);
      passwordHash = response.body.password;
      expect(response.status).toBe(201);
    });

    it('should return a password hash', async () => {
      expect(passwordHash).toBeDefined();
    });
  });

  let token;
  describe('POST /api/login', () => {
    it('should return 200 OK', async () => {
      const user = { username: 'bob', password: '1234' };
      const response = await request(server).post('/api/login').send(user);
      token = response.body.token;
      expect(response.status).toBe(200);
    });

    it('should return a token', async () => {
      expect(token).toBeDefined();
    });
  });

  describe('GET /api/jokes', () => {
    let jokes;
    it('should return 200 OK', async () => {
      jokes = await request(server).get('/api/jokes').set('Authorization', token);
      expect(jokes.status).toBe(200);
    });

    it('should return an array of jokes in results', () => {
      expect(jokes.body).toHaveLength(20);
    });
  });
});