import dotenv from "dotenv";
import pkg from "pg";

dotenv.config({path: "./.env.local"});
const {Client} = pkg;
const pool = new Client({
    connectionString: process.env.DATABASE_URL, ssl: false, // Adjust based on your database settings
});

console.log("DATABASE_URL:", process.env.DATABASE_URL);

async function initializeDB() {
    try {
        console.log("Connecting to database...");
        await pool.connect();
        console.log("Connected to database");

        // create needed enum types
        await pool.query(`
      CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');
      CREATE TYPE channel_access AS ENUM ('open', 'restricted');
      CREATE TYPE message_type AS ENUM ('message', 'announcement');
      CREATE TYPE submission_type AS ENUM ('assignment', 'phase');
    `);

        // Create users table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS Users (
        User_ID VARCHAR(32) PRIMARY KEY,
        USERNAME TEXT,
        Fname TEXT NOT NULL, 
        Lname TEXT NOT NULL,
        Role user_role NOT NULL,
        IMG_URL TEXT
      );
    `);

        // Create courses table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS Course (
        Course_Code VARCHAR(10) PRIMARY KEY,
        Course_Name TEXT NOT NULL,
        Instructor_ID VARCHAR(32),
        max_Grade INTEGER NOT NULL,
        FOREIGN KEY (Instructor_ID) REFERENCES Users (User_ID) ON DELETE SET NULL
      );
    `);

        // Create projects table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS Project (
        Project_ID SERIAL PRIMARY KEY,
        Project_Name TEXT NOT NULL,
        Course_Code VARCHAR(10),
        Start_Date DATE default CURRENT_DATE,
        End_Date DATE,
        Description TEXT,
        Max_team_size INTEGER,
        max_grade INTEGER,
        FOREIGN KEY (Course_Code) REFERENCES Course(Course_Code) ON DELETE SET NULL
      );
    `);

        // Create phase table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS Phase (
        Project_ID INT,
        Phase_Num INT,
        Phase_Name TEXT,
        Phase_load INTEGER NOT NULL,
        deadline DATE,
        PRIMARY KEY (Project_ID, Phase_Num),
        FOREIGN KEY (Project_ID) REFERENCES Project(Project_ID) ON DELETE CASCADE
      );
    `);

        // Create team table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS Team (
        Project_ID INT,
        Team_Num INT,
        Team_Name TEXT,
        PRIMARY KEY (Project_ID, Team_Num),
        FOREIGN KEY (Project_ID) REFERENCES Project(Project_ID) ON DELETE CASCADE
      );
    `);

        // Create chat_group table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS Chat_Group (
        Group_ID SERIAL PRIMARY KEY,
        Group_Name TEXT NOT NULL
      );
    `);

        // Create channel table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS channel (
        Channel_Name TEXT NOT NULL,
        Channel_Num INT,
        Group_ID INT,
        Channel_Type channel_access NOT NULL,
        PRIMARY KEY (Channel_Num, Group_ID),
        FOREIGN KEY (Group_ID) REFERENCES Chat_Group(Group_ID) ON DELETE CASCADE
      );
    `);

        // Create message table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS Message (
        Message_ID SERIAL PRIMARY KEY,
        Channel_Num INT,
        Group_ID INT,
        Time_Stamp TIMESTAMP DEFAULT NOW(),
        Type message_type NOT NULL,
        Content TEXT NOT NULL,
        sender_ID VARCHAR(32),
        FOREIGN KEY (sender_ID) REFERENCES Users(User_ID) ON DELETE CASCADE,
        FOREIGN KEY (Channel_Num, Group_ID) REFERENCES channel(Channel_Num, Group_ID) ON DELETE CASCADE
      );
    `);

        // Create assignment table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS Assignment (
        Assignment_ID SERIAL PRIMARY KEY,
        Title TEXT NOT NULL,
        Max_grade INTEGER NOT NULL,
        Description TEXT,
        Due_Date DATE,
        Course_Code VARCHAR(10),
        FOREIGN KEY (Course_Code) REFERENCES Course(Course_Code) ON DELETE CASCADE
      );
    `);

        // Create submission table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS Submission (
        Submission_ID SERIAL PRIMARY KEY,
        Type submission_type NOT NULL,
        Student_ID VARCHAR(32) NOT NULL,
        Grade INTEGER,
        Submission_date DATE DEFAULT NOW(),
        FOREIGN KEY (Student_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
      );
    `);

        // Create attachment table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS Attachment (
        Attachment_ID SERIAL PRIMARY KEY,
        URL TEXT NOT NULL,
        Format TEXT
      );
    `);

        // Create badge table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS Badge (
        Badge_ID SERIAL PRIMARY KEY,
        Picture TEXT NOT NULL,
        Title TEXT NOT NULL,
        Description TEXT
      );
    `);

        // Create participation table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS participation (
        student_ID VARCHAR(32),
        Project_ID INT,
        Team_Num INT,
        Leader BOOLEAN,
        PRIMARY KEY (student_ID, Project_ID, Team_Num),
        FOREIGN KEY (Project_ID, Team_Num) REFERENCES Team(Project_ID, Team_Num) ON DELETE CASCADE,
        FOREIGN KEY (student_ID) REFERENCES Users(User_ID) ON DELETE SET NULL
      );
    `);

        // Create enrollment table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS enrollment (
        student_ID VARCHAR(32), 
        Course_Code VARCHAR(10),
        PRIMARY KEY (student_ID, Course_Code),
        FOREIGN KEY (Course_Code) REFERENCES Course(Course_Code) ON DELETE CASCADE,
        FOREIGN KEY (student_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
      );
    `);

        // Create messageRead table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS messageRead (
        lastMessageRead_ID INT,
        user_ID VARCHAR(32),
        readAt TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (lastMessageRead_ID, user_ID),
        FOREIGN KEY (lastMessageRead_ID) REFERENCES Message(Message_ID) ON DELETE SET NULL,
        FOREIGN KEY (user_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
      );
    `);

        // Create messageAttachment table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS messageAttachment (
        Message_ID INT,
        Attachment_ID INT,
        PRIMARY KEY (Message_ID, Attachment_ID),
        FOREIGN KEY (Message_ID) REFERENCES Message(Message_ID) ON DELETE CASCADE,
        FOREIGN KEY (Attachment_ID) REFERENCES Attachment(Attachment_ID) ON DELETE CASCADE
      );
    `);

        // Create submission attachment table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS submissionAttachment (
        Attachment_ID INT,
        Submission_ID INT,
        PRIMARY KEY (Attachment_ID, Submission_ID),
        FOREIGN KEY (Attachment_ID) REFERENCES Attachment(Attachment_ID) ON DELETE CASCADE,
        FOREIGN KEY (Submission_ID) REFERENCES Submission(Submission_ID) ON DELETE CASCADE
      );
    `);

        // Create phaseSubmission table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS phaseSubmission (
        Submission_ID INT,
        Project_ID INT,
        Phase_Num INT,
        PRIMARY KEY (Submission_ID, Project_ID, Phase_Num),
        FOREIGN KEY (Submission_ID) REFERENCES Submission(Submission_ID) ON DELETE CASCADE,
        FOREIGN KEY (Project_ID, Phase_Num) REFERENCES Phase(Project_ID, Phase_Num) ON DELETE CASCADE
      );
    `);

        // Create assignmentSubmission table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS AssignmentSubmission (
        Submission_ID INT,
        Assignment_ID INT,
        PRIMARY KEY (Submission_ID, Assignment_ID),
        FOREIGN KEY (Assignment_ID) REFERENCES Assignment(Assignment_ID) ON DELETE CASCADE,
        FOREIGN KEY (Submission_ID) REFERENCES Submission(Submission_ID) ON DELETE CASCADE
      );
    `);

        // Create reviews table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS review (
        reviewer_ID VARCHAR(32),
        reviewee_ID VARCHAR(32),
        Project_ID INT,
        content TEXT,
        rating INTEGER,
        PRIMARY KEY (reviewer_ID, reviewee_ID, Project_ID),
        FOREIGN KEY (Project_ID) REFERENCES Project(Project_ID) ON DELETE CASCADE,
        FOREIGN KEY (reviewer_ID) REFERENCES Users(User_ID) ON DELETE CASCADE,
        FOREIGN KEY (reviewee_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
      );
    `);

        // Create earnedbadges table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS earnedBadges (
        student_ID VARCHAR(32),
        Badge_ID INT,
        earned_at DATE,
        PRIMARY KEY (student_ID, Badge_ID),
        FOREIGN KEY (Badge_ID) REFERENCES Badge(Badge_ID) ON DELETE CASCADE,
        FOREIGN KEY (student_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
      );
    `);

        console.log("Tables created");
        await pool.end();
        console.log("Disconnected from database");
    } catch (err) {
        console.error("Error initializing database:", err);
    }
}

initializeDB();
