const request = require('supertest');
const nock = require('nock');
const app = require('./index');

beforeAll(() => {
  nock.disableNetConnect();
  nock.enableNetConnect(/^(127\.0\.0\.1|localhost|\[::1\])(?::\d+)?$/);
});
afterEach(() => {
  const pending = nock.pendingMocks();
  nock.cleanAll();
  expect(pending).toEqual([]);
});
afterAll(() => nock.enableNetConnect());

describe('Test todo methods', () => {
  it('Returns all todos', async () => {
    const response = await request(app).get('/todo').expect(200);
    expect(response.body).toEqual([
      { id: 1, name: 'Finished writing a blogpost' },
      { id: 2, name: 'Get pizza for dinner' },
      { id: 3, name: 'Wake up at 7:30am' },
    ]);
  });
  it('Returns a todo with id 2', async () => {
    const response = await request(app).get('/todo/2').expect(200);
    expect(response.body.name).toBe('Get pizza for dinner');
  });
  it.each([1, 3])('Returns the requested todo %i', async (id) => {
    const response = await request(app).get(`/todo/${id}`).expect(200);
    expect(response.body.id).toBe(id);
  });
  it('Returns 404 for an unknown todo', async () => {
    await request(app).get('/todo/99').expect(404);
  });
  it.each(['abc', '0', '-2', '1.5'])('Rejects invalid ID %s', async (id) => {
    await request(app).get(`/todo/${id}`).expect(400);
  });
});

describe('Test responses from querying an external API', () => {
  it('Should retrieve a random Chuck Norris joke', async () => {
    nock('https://api.chucknorris.io').get('/jokes/random')
      .reply(200, { id: 'joke-1', value: 'A sample joke from the API.' });
    const response = await request(app).get('/joke').expect(200);
    expect(JSON.parse(response.text).value).toBeTruthy();
  });
  it('Returns fresh API responses on two requests', async () => {
    nock('https://api.chucknorris.io')
      .get('/jokes/random').reply(200, { value: 'First sample joke.' })
      .get('/jokes/random').reply(200, { value: 'Second sample joke.' });
    const first = await request(app).get('/joke').expect(200);
    const second = await request(app).get('/joke').expect(200);
    expect(first.body.value === second.body.value).toBeFalsy();
  });
  it('Handles upstream HTTP errors', async () => {
    nock('https://api.chucknorris.io').get('/jokes/random').reply(503);
    await request(app).get('/joke').expect(502);
  });
  it('Handles invalid API JSON', async () => {
    nock('https://api.chucknorris.io').get('/jokes/random').reply(200, 'not JSON');
    await request(app).get('/joke').expect(502);
  });
  it('Handles missing joke text', async () => {
    nock('https://api.chucknorris.io').get('/jokes/random').reply(200, {});
    await request(app).get('/joke').expect(502);
  });
  it('Handles network errors', async () => {
    nock('https://api.chucknorris.io').get('/jokes/random').replyWithError('Offline');
    await request(app).get('/joke').expect(502);
  });
});

it('Returns a greeting and valid date', async () => {
  const response = await request(app).get('/').expect(200);
  expect(response.body.msg).toBe('Greetings!');
  expect(Number.isNaN(Date.parse(response.body.date))).toBe(false);
});
