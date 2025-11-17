const mongoose = require('mongoose');

const ConnectToDB = async () => {
  // console.log(process.env.MONGODB_URL)
  await mongoose.connect(process.env.MONGODB_URL)
}

module.exports = ConnectToDB;
