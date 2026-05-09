const express = require('express');

const app = express();
app.get('/ap/v1/tours', (req, res) => {});

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port: ${port}...`);
});
