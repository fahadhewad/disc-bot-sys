const express = require('express');
const app = express();
const port = 3000;

app.get('/increment', (req, res) => {
  res.send('Main Server increments counter!');
});

app.get('/counter', (req, res) => {
  res.send('Main Server sends counter back');
});

app.listen(port, () => {
  console.log(`NodeJS app listening at http://localhost:${port}`);
});