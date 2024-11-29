import pool from "../lib/db";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

console.log("DATABASE_URL:", process.env.DATABASE_URL); // Verify this line is working

async function dropDB() {
  try {
    console.log("Connecting to database...");
    await pool.connect();
    console.log("Connected to database");

    // Drop tables
    await pool.query(`
      DROP TABLE IF EXISTS messageRead;
      DROP TABLE IF EXISTS messageAttachment;
      DROP TABLE IF EXISTS submissionAttachment;
      DROP TABLE IF EXISTS phaseSubmission;
      DROP TABLE IF EXISTS AssignmentSubmission;
      DROP TABLE IF EXISTS review;
      DROP TABLE IF EXISTS earnedBadges;
      DROP TABLE IF EXISTS participation;
      DROP TABLE IF EXISTS enrollment;
      DROP TABLE IF EXISTS Message;
      DROP TABLE IF EXISTS channel;
      DROP TABLE IF EXISTS Chat_Group;
      DROP TABLE IF EXISTS Team;
      DROP TABLE IF EXISTS Phase;
      DROP TABLE IF EXISTS Project;
      DROP TABLE IF EXISTS Assignment;
      DROP TABLE IF EXISTS Submission;
      DROP TABLE IF EXISTS Attachment;
      DROP TABLE IF EXISTS Badge;
      DROP TABLE IF EXISTS Course;
      DROP TABLE IF EXISTS Users;
    `);
    console.log("Tables dropped");

    await pool.end();
    console.log("Disconnected from database");
  } catch (err) {
    console.error("Error dropping tables:", err);
  }
}

dropDB();
