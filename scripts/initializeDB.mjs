import dotenv from "dotenv";
import pkg from "pg";

dotenv.config({path: "./.env.local"});
const {Pool} = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, ssl: false, // Adjust based on your database settings
});


console.log("DATABASE_URL:", process.env.DATABASE_URL);

async function initializeDB() {
  try {
    console.log("Connecting to database...");
    await pool.connect();
    console.log("Connected to database");

    // Your table creation or other initialization logic
    await pool.query(`
      CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');
      CREATE TABLE IF NOT EXISTS Users (
        User_ID VARCHAR(7) PRIMARY KEY,
        Fname TEXT,
        Lname TEXT,
        Role user_role
      );

      CREATE TABLE IF NOT EXISTS Course (
        Course_Code VARCHAR(10) PRIMARY KEY,
        Course_Name TEXT,
        Instructor_ID VARCHAR(7),
        max_Grade INTEGER,
        FOREIGN KEY (Instructor_ID) REFERENCES Users (User_ID)
      );

      CREATE TABLE IF NOT EXISTS Project (
        Project_ID SERIAL PRIMARY KEY,
        Project_Name TEXT,
        Course_Code VARCHAR(10),
        Start_Date DATE,
        End_Date DATE,
        Description TEXT,
        Max_team_size INTEGER,
        FOREIGN KEY (Course_Code) REFERENCES Course(Course_Code)
      );

      CREATE TABLE IF NOT EXISTS Phase (
        Project_ID INT,
        Phase_Num INT,
        Phase_Name TEXT,
        Phase_load INTEGER,
        deadline DATE,
        PRIMARY KEY (Project_ID, Phase_Num),
        FOREIGN KEY (Project_ID) REFERENCES Project(Project_ID)
      );

      CREATE TABLE IF NOT EXISTS Team (
        Project_ID INT,
        Team_Num INT,
        Team_Name TEXT,
        PRIMARY KEY (Project_ID, Team_Num),
        FOREIGN KEY (Project_ID) REFERENCES Project(Project_ID)
      );

      CREATE TABLE IF NOT EXISTS Chat_Group (
        Group_ID INTEGER PRIMARY KEY,
        Group_Name TEXT
      );

      CREATE TYPE channel_access AS ENUM ('open', 'restricted');
      CREATE TABLE IF NOT EXISTS channel (
        Channel_Name TEXT,
        Channel_Num INT,
        Group_ID INT,
        Channel_Type channel_access,
        PRIMARY KEY (Channel_Num, Group_ID),
        FOREIGN KEY (Group_ID) REFERENCES Chat_Group(Group_ID)
      );

      CREATE TYPE message_type AS ENUM ('message', 'announcement');
      CREATE TABLE IF NOT EXISTS Message (
        Message_ID SERIAL PRIMARY KEY,
        Channel_Num INT,
        Group_ID INT,
        Time_Stamp TIMESTAMP DEFAULT NOW(),
        Type message_type,
        Content TEXT,
        sender_ID VARCHAR(7),
        FOREIGN KEY (sender_ID) REFERENCES Users(User_ID),
        FOREIGN KEY (Channel_Num, Group_ID) REFERENCES channel (Channel_Num, Group_ID)
      );

      CREATE TABLE IF NOT EXISTS Assignment (
        Assignment_ID SERIAL PRIMARY KEY,
        Title TEXT,
        Max_grade INTEGER,
        Description TEXT,
        Due_Date DATE,
        Course_Code VARCHAR(10),
        FOREIGN KEY (Course_Code) REFERENCES Course(Course_Code)
      );

      CREATE TYPE submission_type AS ENUM ('assignment', 'phase');
      CREATE TABLE IF NOT EXISTS Submission (
        Submission_ID SERIAL PRIMARY KEY,
        Type submission_type,
        Student_ID VARCHAR(7),
        Grade INTEGER,
        Submission_date DATE,
        FOREIGN KEY (Student_ID) REFERENCES Users(User_ID)
      );

      CREATE TABLE IF NOT EXISTS Attachment (
        Attachment_ID SERIAL PRIMARY KEY,
        URL TEXT,
        Format TEXT
      );

      CREATE TABLE IF NOT EXISTS Badge (
        Badge_ID SERIAL PRIMARY KEY,
        Picture TEXT,
        Title TEXT,
        Description TEXT
      );

      CREATE TABLE IF NOT EXISTS participation (
        student_ID VARCHAR(7),
        Project_ID INT,
        Team_Num INT,
        Leader BOOLEAN,
        PRIMARY KEY (student_ID, Project_ID, Team_Num),
        FOREIGN KEY (Project_ID, Team_Num) REFERENCES Team(Project_ID, Team_Num),
        FOREIGN KEY (student_ID) REFERENCES Users(User_ID)
      );

      CREATE TABLE IF NOT EXISTS enrollment (
        student_ID VARCHAR(7), 
        Course_Code VARCHAR(10),
        PRIMARY KEY (student_ID, Course_Code),
        FOREIGN KEY (Course_Code) REFERENCES Course(Course_Code),
        FOREIGN KEY (student_ID) REFERENCES Users(User_ID)
      );

      CREATE TABLE IF NOT EXISTS messageRead (
        lastMessageRead_ID INT,
        user_ID VARCHAR(7),
        readAt TIMESTAMP,
        PRIMARY KEY (lastMessageRead_ID, user_ID),
        FOREIGN KEY (lastMessageRead_ID) REFERENCES Message (Message_ID),
        FOREIGN KEY (user_ID) REFERENCES Users(User_ID)
      );

      CREATE TABLE IF NOT EXISTS messageAttachment (
        Message_ID INT,
        Attachment_ID INT,
        PRIMARY KEY (Message_ID, Attachment_ID),
        FOREIGN KEY (Message_ID) REFERENCES Message(Message_ID),
        FOREIGN KEY (Attachment_ID) REFERENCES Attachment (Attachment_ID)
      );

      CREATE TABLE IF NOT EXISTS submissionAttachment (
        Attachment_ID INT,
        Submission_ID INT,
        PRIMARY KEY (Attachment_ID, Submission_ID),
        FOREIGN KEY (Attachment_ID) REFERENCES Attachment(Attachment_ID),
        FOREIGN KEY (Submission_ID) REFERENCES Submission (Submission_ID)
      );

      CREATE TABLE IF NOT EXISTS phaseSubmission (
        Submission_ID INT,
        Project_ID INT,
        Phase_Num INT,
        PRIMARY KEY (Submission_ID, Project_ID, Phase_Num),
        FOREIGN KEY (Submission_ID) REFERENCES Submission (Submission_ID),
        FOREIGN KEY (Project_ID, Phase_Num) REFERENCES Phase (Project_ID, Phase_Num)
      );

      CREATE TABLE IF NOT EXISTS AssignmentSubmission (
        Submission_ID INT,
        Assignment_ID INT,
        PRIMARY KEY (Submission_ID, Assignment_ID),
        FOREIGN KEY (Assignment_ID) REFERENCES Assignment(Assignment_ID),
        FOREIGN KEY (Submission_ID) REFERENCES Submission (Submission_ID)
      );

      CREATE TABLE IF NOT EXISTS review (
        reviewer_ID VARCHAR(7),
        reviewee_ID VARCHAR(7),
        Project_ID INT,
        content TEXT,
        rating INTEGER,
        PRIMARY KEY (reviewer_ID, reviewee_ID, Project_ID),
        FOREIGN KEY (Project_ID) REFERENCES Project (Project_ID),
        FOREIGN KEY (reviewer_ID) REFERENCES Users (User_ID),
        FOREIGN KEY (reviewee_ID) REFERENCES Users (User_ID) 
      );

      CREATE TABLE IF NOT EXISTS earnedBadges (
        student_ID VARCHAR(7),
        Badge_ID INT,
        earned_at DATE,
        PRIMARY KEY (student_ID, Badge_ID),
        FOREIGN KEY (Badge_ID) REFERENCES Badge(Badge_ID),
        FOREIGN KEY (student_ID) REFERENCES Users (User_ID)    
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
