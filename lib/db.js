import pkg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Adjust based on your database settings
});
export default pool;
