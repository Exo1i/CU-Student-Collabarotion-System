import dotenv from "dotenv";
import pkg from "pg";

dotenv.config({path: "./.env.local"});
const {Client} = pkg;
const pool = new Client({
    connectionString: process.env.DATABASE_URL, ssl: false, // Adjust based on your database settings
});


console.log("DATABASE_URL:", process.env.DATABASE_URL);

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

        // Drop existing types
        const typesToDrop = ['user_role', 'channel_access', 'message_type', 'submission_type'];

        // Drop types
        for (const type of typesToDrop) {
            await pool.query(`DROP TYPE IF EXISTS ${type} CASCADE`);
            console.log(`Dropped type ${type}`);
        }


        await pool.end();
        console.log("Disconnected from database");
    } catch (err) {
        console.error("Error dropping tables:", err);
    }
}

dropDB();
