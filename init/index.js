const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust2");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68810bce2870e8aa737f4b4c",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data initialized");
};

initDB();
