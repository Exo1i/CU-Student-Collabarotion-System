import pool from "../lib/db";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

console.log("DATABASE_URL:", process.env.DATABASE_URL); // Verify this line is working

async function clearDB() {
  try {
    console.log("Connecting to database...");
    await pool.connect();
    console.log("Connected to database");

    // Truncate all tables to remove data
    await pool.query(`
      TRUNCATE TABLE 
        messageRead,
        messageAttachment,
        submissionAttachment,
        phaseSubmission,
        AssignmentSubmission,
        review,
        earnedBadges,
        participation,
        enrollment,
        Message,
        channel,
        Chat_Group,
        Team,
        Phase,
        Project,
        Assignment,
        Submission,
        Attachment,
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
