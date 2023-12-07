const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/tours');

dotenv.config({ path: './config.env' });

const DB = process.env.DB.replace('<password>', process.env.DB_PASSWORD);

(async () => {
  try {
    await mongoose.connect(DB);
    console.log('✔ connected to database ⛁');
  } catch (err) {
    console.log('❌ failed connection', +err);
  }
})();

const data = JSON.parse(fs.readFileSync('./dev-data/tours.json', 'utf-8'));

const deleteAllData = async () => {
  try {
    await Tour.deleteMany();
    console.log('deleted all data');
  } catch (error) {
    console.log(error);
  }
};

const importAllData = async () => {
  try {
    console.log('importing data ---------------->>');
    const res = await Tour.create(data);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const args = process.argv;
if (args[2] === '--delete') deleteAllData();
if (args[2] === '--import') importAllData();
