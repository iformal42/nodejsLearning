const fs = require('fs/promises');
const Tour = require('../models/tourModel');

async function importData() {
  try {
    const tours = await fs.readFile('dev-data/data/tours-simple.json', {
      encoding: 'utf-8',
    });

    // console.log(JSON.parse(tours));
    await Tour.insertMany(JSON.parse(tours));
  } catch (error) {
    console.error(error);
  }
}
async function DeleteImportData() {
  try {
    await Tour.deleteMany();
    console.log('data delete successfully');
  } catch (error) {
    console.error(error.message);
  }
}

// console.log(process.argv);
module.exports = {
  DeleteImportData,
  importData,
};
// if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') DeleteImportData();
