// At the top of your file or in a separate config file
const NodeGeocoder = require("node-geocoder");

// Load environment variables if not already done
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const options = {
  provider: 'opencage', 
  apiKey: process.env.OPENCAGE_API_KEY, 
  formatter: null // No need to format the results
};

const geocoder = NodeGeocoder(options);
module.exports = geocoder;
