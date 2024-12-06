import dotenv from "dotenv";
import pkg from "pg";

dotenv.config({ path: "./.env.local" });
const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

console.log("DATABASE_URL:", process.env.DATABASE_URL);

async function insertSampleData() {
  try {
    // Insert sample data into Users table
    await pool.query(`
      INSERT INTO Users (User_ID, Fname, Lname, Role) VALUES 
      ('user001', 'Alice', 'Smith', 'instructor'),
      ('user002', 'Bob', 'Johnson', 'student'),
      ('user003', 'Carol', 'Williams', 'admin');
    `);
    console.log("Sample data inserted into Users table");

    // Insert sample data into Course table
    await pool.query(`
      INSERT INTO Course (Course_Code, Course_Name, Instructor_ID, max_Grade) VALUES 
      ('CMP2020', 'Computer Science 101', 'user001', 100);
    `);
    console.log("Sample data inserted into Course table");

    // Insert sample data into Project table
    await pool.query(`
      INSERT INTO Project (Project_Name, Course_Code, Start_Date, End_Date, Description, Max_team_size) VALUES 
      ('Project Alpha', 'CMP2020', '2024-01-01', '2024-03-01', 'Introduction to Algorithms', 4);
    `);
    console.log("Sample data inserted into Project table");

    // Insert sample data into Phase table
    await pool.query(`
      INSERT INTO Phase (Project_ID, Phase_Num, Phase_Name, Phase_load, deadline) VALUES 
      (1, 1, 'Phase One', 20, '2024-01-15'),
      (1, 2, 'Phase Two', 30, '2024-02-15');
    `);
    console.log("Sample data inserted into Phase table");

    // Insert sample data into Team table
    await pool.query(`
      INSERT INTO Team (Project_ID, Team_Num, Team_Name) VALUES 
      (1, 1, 'Team A'),
      (1, 2, 'Team B');
    `);
    console.log("Sample data inserted into Team table");

    // Insert sample data into Chat_Group table
    await pool.query(`
      INSERT INTO Chat_Group (Group_ID, Group_Name) VALUES 
      (1, 'Group One'),
      (2, 'Group Two');
    `);
    console.log("Sample data inserted into Chat_Group table");

    // Insert sample data into channel table
    await pool.query(`
      INSERT INTO channel (Channel_Name, Channel_Num, Group_ID, Channel_Type) VALUES 
      ('General', 1, 1, 'open'),
      ('Random', 2, 1, 'open');
    `);
    console.log("Sample data inserted into channel table");

    // Insert sample data into Message table
    await pool.query(`
      INSERT INTO Message (Channel_Num, Group_ID, Time_Stamp, Type, Content, sender_ID) VALUES 
      (1, 1, NOW(), 'message', 'Hello everyone!', 'user001'),
      (2, 1, NOW(), 'announcement', 'This is a random channel.', 'user002');
    `);
    console.log("Sample data inserted into Message table");

    // Insert sample data into Assignment table
    await pool.query(`
      INSERT INTO Assignment (Title, Max_grade, Description, Due_Date, Course_Code) VALUES 
      ('Assignment 1', 100, 'First assignment description', '2024-01-20', 'CMP2020');
    `);
    console.log("Sample data inserted into Assignment table");

    // Insert sample data into Submission table
    await pool.query(`
      INSERT INTO Submission (Type, Student_ID, Grade, Submission_date) VALUES 
      ('phase', 'user002', 90, '2024-01-18');
    `);
    console.log("Sample data inserted into Submission table");

    // Insert sample data into Attachment table
    await pool.query(`
      INSERT INTO Attachment (URL, Format) VALUES 
      ('http://example.com/attachment1.pdf', 'PDF'),
      ('http://example.com/attachment2.jpg', 'JPEG');
    `);
    console.log("Sample data inserted into Attachment table");

    // Insert sample data into Badge table
    await pool.query(`
      INSERT INTO Badge (Picture, Title, Description) VALUES 
      ('http://example.com/badge1.png', 'Top Performer', 'Awarded for outstanding performance');
    `);
    console.log("Sample data inserted into Badge table");

    // Insert sample data into participation table
    await pool.query(`
      INSERT INTO participation (student_ID, Project_ID, Team_Num, Leader) VALUES 
      ('user002', 1, 1, true),
      ('user003', 1, 1, false);
    `);
    console.log("Sample data inserted into participation table");

    // Insert sample data into enrollment table
    await pool.query(`
      INSERT INTO enrollment (student_ID, Course_Code) VALUES 
      ('user002', 'CMP2020'),
      ('user003', 'CMP2020');
    `);
    console.log("Sample data inserted into enrollment table");

    // Insert sample data into messageRead table
    await pool.query(`
      INSERT INTO messageRead (lastMessageRead_ID, user_ID, readAt) VALUES 
      (1, 'user001', NOW());
    `);
    console.log("Sample data inserted into messageRead table");

    // Insert sample data into messageAttachment table
    await pool.query(`
      INSERT INTO messageAttachment (Message_ID, Attachment_ID) VALUES 
      (1, 1);
    `);
    console.log("Sample data inserted into messageAttachment table");

    // Insert sample data into submissionAttachment table
    await pool.query(`
      INSERT INTO submissionAttachment (Attachment_ID, Submission_ID) VALUES 
      (1, 1);
    `);
    console.log("Sample data inserted into submissionAttachment table");

    // Insert sample data into phaseSubmission table
    await pool.query(`
      INSERT INTO phaseSubmission (Submission_ID, Project_ID, Phase_Num) VALUES 
      (1, 1, 1);
    `);
    console.log("Sample data inserted into phaseSubmission table");

    // Insert sample data into AssignmentSubmission table
    await pool.query(`
      INSERT INTO AssignmentSubmission (Submission_ID, Assignment_ID) VALUES 
      (1, 1);
    `);
    console.log("Sample data inserted into AssignmentSubmission table");

    // Insert sample data into review table
    await pool.query(`
      INSERT INTO review (reviewer_ID, reviewee_ID, Project_ID, content, rating) VALUES 
      ('user002', 'user003', 1, 'Great work!', 5);
    `);
    console.log("Sample data inserted into review table");

    // Insert sample data into earnedBadges table
    await pool.query(`
      INSERT INTO earnedBadges (student_ID, Badge_ID, earned_at) VALUES 
      ('user002', 1, '2024-02-01');
    `);
    console.log("Sample data inserted into earnedBadges table");

    await pool.end();
    console.log("Disconnected from database");
  } catch (err) {
    console.error("Error inserting sample data:", err);
  }
}

insertSampleData();
