const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const filePath = 'counter.txt';

function readCounter() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return parseInt(data, 10);
  } catch (err) {
    console.error(err);
    return 0;
  }
}

function writeCounter(value) {
  try {
    fs.writeFileSync(filePath, value.toString(), 'utf8');
  } catch (err) {
    console.error(err);
  }
}

app.get('/increment', (req, res) => {
  let counter = readCounter();
  counter++;
  writeCounter(counter);
  res.send(`Counter incremented!`);
});

app.get('/counter', (req, res) => {
  const counter = readCounter();
  res.send(`Current troll count: ${counter}`)
});

app.listen(port, () => {
  console.log(`NodeJS app listening at http://localhost:${port}`);
});