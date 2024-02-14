const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Main Server says "Hello!"');
});

app.listen(port, () => {
  console.log(`NodeJS app listening at http://localhost:${port}`);
});