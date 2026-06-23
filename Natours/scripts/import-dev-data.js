const fs = require('fs/promises');
const Tour = require('../models/tourModel');
const User = require('../models/userModal');
const Review = require('../models/reviewModel');

async function importData() {
  try {
    const tours = await fs.readFile('dev-data/data/tours.json', {
      encoding: 'utf-8',
    });
    // const users = await fs.readFile('dev-data/data/users.json', {
    //   encoding: 'utf-8',
    // });
    // const reviews = await fs.readFile('dev-data/data/reviews.json', {
    //   encoding: 'utf-8',
    // });

    const allTours = JSON.parse(tours);
    console.log(allTours);

    for (const tour of allTours) {
      // console.log(tour.name);
      await Tour.create(tour);
    }
    // await Tour.insertMany(JSON.parse(tours));
    // await User.insertMany(JSON.parse(users), { lean: true });
    // await Review.insertMany(JSON.parse(reviews));
  } catch (error) {
    console.error(error);
  }
}
async function updateData() {
  try {
    let tours = await fs.readFile('dev-data/data/tours.json', {
      encoding: 'utf-8',
    });
    tours = JSON.parse(tours);

    tours.forEach((tour) => {
      Tour.updateOne(
        {
          name: tour.name,
        },
        {
          startDates: tour.startDates,
        },
        {
          runValidators: true,
        },
      );
    });
  } catch (error) {
    console.error(error);
  }
}
async function DeleteImportData() {
  try {
    await Tour.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();
    console.log('data delete successfully');
  } catch (error) {
    console.error(error.message);
  }
}

// console.log(process.argv);
module.exports = {
  DeleteImportData,
  importData,
  updateData,
};
// if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') DeleteImportData();
