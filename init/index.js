const mongoose = require('mongoose');
const sampledata = require('../init/init.js');
const Listing = require('../models/listing.js');
const initData = require('./init.js');

main().then((res) => {
  console.log('Connection Succesfull')
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initdb = async () => {
  initData.data = initData.data.map((listing) => {
    return { ...listing, owner: '67fe61cc16baad12fabd99f1' };
  });
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
}

initdb();


