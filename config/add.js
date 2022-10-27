const fs = require('fs');

const Tour = require('./../models/tour');
const Review = require('./../models/reviews');
const User = require('./../models/user');
const connectDB = require('./connect');

require('dotenv').config();

//Connect to the database
connectDB(process.env.MONGO_URI);

//Fetch datas array from file their respective json files
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`, 'utf8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/reviews.json`, 'utf8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`, 'utf8')
);

//To import data
const importData = async () => {
  try {
    await Tour.create(tours);
    await Review.create(reviews);
    await User.create(users, { validateBeforeSave: false });
    console.log('Successfully imported');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//To delete the datas in the db
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();
    console.log('Successfully deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//Execution :]
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
//console.log(process.argv);
