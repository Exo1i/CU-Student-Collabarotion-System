const { Pool } = require("pg");
require("dotenv").config({ path: "../.env.local" });
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Adjust based on your database settings
});
module.exports = pool;
