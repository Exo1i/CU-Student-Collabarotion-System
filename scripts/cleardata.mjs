import dotenv from "dotenv";
import pkg from "pg";

dotenv.config({ path: "./.env.local" });
const { Client } = pkg;
const pool = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Adjust based on your database settings
});

console.log("DATABASE_URL:", process.env.DATABASE_URL);

async function clearDB() {
  try {
    console.log("Connecting to database...");
    await pool.connect();
    console.log("Connected to database");

    // Truncate all tables to remove data
    await pool.query(`
      TRUNCATE TABLE 
        messageRead,
        phaseSubmission,
        AssignmentSubmission,
        review,
        earnedBadges,
        participation,
        enrollment,
        Message,
        channel,
        Chat_Group,
        technology,
        Team,
        Phase,
        Project,
        Assignment,
        Submission,
        Badge,
        Course,
        Users 
      RESTART IDENTITY CASCADE;
    `);
    console.log("Tables truncated and data cleared");

    await pool.end();
    console.log("Disconnected from database");
  } catch (err) {
    console.error("Error clearing data:", err);
  }
}

clearDB();
