const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.error('UNHANDLE Exception! 💥 Shutting down');
  console.error(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './.env' });
const app = require('./app');
const { importData, DeleteImportData } = require('./scripts/import-dev-data');

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
  })
  .catch((err) => console.log('Error', err));

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`Listening on port: ${port}...`);
});
// DeleteImportData();
importData();
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLE REJECTION! 💥 Shutting down');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});
