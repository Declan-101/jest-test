const express = require('express');
const https = require('https');
const app = express();

function allTodos() {
  return [
    { id: 1, name: 'Finished writing a blogpost' },
    { id: 2, name: 'Get pizza for dinner' },
    { id: 3, name: 'Wake up at 7:30am' },
  ];
}

app.get('/', (req, res) => {
  res.json({ date: new Date(), msg: 'Greetings!' });
});

app.get('/todo', (req, res) => res.json(allTodos()));

app.get('/todo/:id', (req, res) => {
  const todoId = Number(req.params.id);
  if (!Number.isInteger(todoId) || todoId < 1) {
    return res.status(400).json({ error: 'Todo ID must be a positive integer.' });
  }
  const todo = allTodos().find((item) => item.id === todoId);
  if (!todo) return res.status(404).json({ error: 'Todo not found.' });
  res.json(todo);
});

app.get('/joke', (req, res) => {
  const fail = () => {
    if (!res.headersSent) {
      res.status(502).json({ error: 'Unable to retrieve a joke. Please try again.' });
    }
  };
  const upstream = https.get('https://api.chucknorris.io/jokes/random', (response) => {
    if (response.statusCode !== 200) {
      response.resume();
      return fail();
    }
    let data = '';
    response.setEncoding('utf8');
    response.on('data', (chunk) => { data += chunk; });
    response.on('error', fail);
    response.on('aborted', fail);
    response.on('end', () => {
      if (res.headersSent) return;
      try {
        const joke = JSON.parse(data);
        if (typeof joke.value !== 'string' || !joke.value.trim()) return fail();
        res.json(joke);
      } catch (error) {
        fail();
      }
    });
  });
  upstream.on('error', fail);
  upstream.setTimeout(5000, () => upstream.destroy(new Error('Joke API timed out')));
});

// Importing the app for tests does not start a persistent server.
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on port => ${port}`));
}

module.exports = app;
