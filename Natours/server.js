const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('DB connected to: ', con.connections[0].name);
  });

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port: ${port}...`);
});
