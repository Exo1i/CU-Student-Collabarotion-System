import dotenv from "dotenv";
import pkg from "pg";

dotenv.config({ path: "./.env.local" });
const { Client } = pkg;
const pool = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Adjust based on your database settings
});

async function insertSampleData() {
  try {
    console.log("Connecting to database...");
    await pool.connect();
    console.log("Connected to database");

    //Users - 30 records (20 instructors, 10 students)
    await pool.query(`
      INSERT INTO Users (User_ID, Fname, Lname, Role, img_url, username) VALUES
      ('inst001', 'James', 'Smith', 'instructor', 'https://placeholder.com/inst1.jpg', 'jsmith'),
      ('inst002', 'Maria', 'Garcia', 'instructor', 'https://placeholder.com/inst2.jpg', 'mgarcia'),
      ('inst003', 'Robert', 'Johnson', 'instructor', 'https://placeholder.com/inst3.jpg', 'rjohnson'),
      ('inst004', 'Lisa', 'Brown', 'instructor', 'https://placeholder.com/inst4.jpg', 'lbrown'),
      ('inst005', 'Michael', 'Davis', 'instructor', 'https://placeholder.com/inst5.jpg', 'mdavis'),
      ('inst006', 'Sarah', 'Wilson', 'instructor', 'https://placeholder.com/inst6.jpg', 'swilson'),
      ('inst007', 'David', 'Taylor', 'instructor', 'https://placeholder.com/inst7.jpg', 'dtaylor'),
      ('inst008', 'Emma', 'Anderson', 'instructor', 'https://placeholder.com/inst8.jpg', 'eanderson'),
      ('inst009', 'Thomas', 'Martinez', 'instructor', 'https://placeholder.com/inst9.jpg', 'tmartinez'),
      ('inst010', 'Patricia', 'Lopez', 'instructor', 'https://placeholder.com/inst10.jpg', 'plopez'),
      ('inst011', 'Christopher', 'Lee', 'instructor', 'https://placeholder.com/inst11.jpg', 'clee'),
      ('inst012', 'Michelle', 'Wong', 'instructor', 'https://placeholder.com/inst12.jpg', 'mwong'),
      ('inst013', 'Richard', 'Chen', 'instructor', 'https://placeholder.com/inst13.jpg', 'rchen'),
      ('inst014', 'Jennifer', 'Kim', 'instructor', 'https://placeholder.com/inst14.jpg', 'jkim'),
      ('inst015', 'Kevin', 'Patel', 'instructor', 'https://placeholder.com/inst15.jpg', 'kpatel'),
      ('inst016', 'Amanda', 'Singh', 'instructor', 'https://placeholder.com/inst16.jpg', 'asingh'),
      ('inst017', 'Brian', 'Zhang', 'instructor', 'https://placeholder.com/inst17.jpg', 'bzhang'),
      ('inst018', 'Rachel', 'Kumar', 'instructor', 'https://placeholder.com/inst18.jpg', 'rkumar'),
      ('inst019', 'Justin', 'Nguyen', 'instructor', 'https://placeholder.com/inst19.jpg', 'jnguyen'),
      ('inst020', 'Sophia', 'Santos', 'instructor', 'https://placeholder.com/inst20.jpg', 'ssantos'),
      ('stud001', 'John', 'Doe', 'student', 'https://placeholder.com/stud1.jpg', 'jdoe'),
      ('stud002', 'Jane', 'Smith', 'student', 'https://placeholder.com/stud2.jpg', 'jsmith2'),
      ('stud003', 'Alex', 'Johnson', 'student', 'https://placeholder.com/stud3.jpg', 'ajohnson'),
      ('stud004', 'Emily', 'Brown', 'student', 'https://placeholder.com/stud4.jpg', 'ebrown'),
      ('stud005', 'Michael', 'Wilson', 'student', 'https://placeholder.com/stud5.jpg', 'mwilson'),
      ('stud006', 'Sarah', 'Davis', 'student', 'https://placeholder.com/stud6.jpg', 'sdavis'),
      ('stud007', 'David', 'Garcia', 'student', 'https://placeholder.com/stud7.jpg', 'dgarcia'),
      ('stud008', 'Emma', 'Martinez', 'student', 'https://placeholder.com/stud8.jpg', 'emartinez'),
      ('stud009', 'Ryan', 'Anderson', 'student', 'https://placeholder.com/stud9.jpg', 'randerson'),
      ('stud010', 'Olivia', 'Taylor', 'student', 'https://placeholder.com/stud10.jpg', 'otaylor'),
      ('stud011', 'William', 'Thomas', 'student', 'https://placeholder.com/stud11.jpg', 'wthomas'),
      ('stud012', 'Sophia', 'Moore', 'student', 'https://placeholder.com/stud12.jpg', 'smoore'),
      ('stud013', 'James', 'Jackson', 'student', 'https://placeholder.com/stud13.jpg', 'jjackson'),
      ('stud014', 'Isabella', 'White', 'student', 'https://placeholder.com/stud14.jpg', 'iwhite'),
      ('stud015', 'Ethan', 'Harris', 'student', 'https://placeholder.com/stud15.jpg', 'eharris');
    `);

    //courses - 20 records
    await pool.query(`
      INSERT INTO Course (Course_Code, Course_Name, Course_img, description, Instructor_ID, max_Grade) VALUES
      ('CS101', 'Introduction to Programming', 'cs101.jpg', 'Basic programming concepts and principles', 'inst001', 100),
      ('CS102', 'Data Structures', 'cs102.jpg', 'Fundamental data structures and algorithms', 'inst002', 100),
      ('CS201', 'Database Systems', 'cs201.jpg', 'Database design and management', 'inst003', 100),
      ('CS202', 'Web Development', 'cs202.jpg', 'Web technologies and applications', 'inst004', 150),
      ('CS301', 'Software Engineering', 'cs301.jpg', 'Software development lifecycle', 'inst005', 100),
      ('CS302', 'Artificial Intelligence', 'cs302.jpg', 'AI concepts and applications', 'inst006', 100),
      ('CS401', 'Computer Networks', 'cs401.jpg', 'Network protocols and architecture', 'inst007', 150),
      ('CS402', 'Cybersecurity', 'cs402.jpg', 'Security principles and practices', 'inst008', 100),
      ('CS501', 'Cloud Computing', 'cs501.jpg', 'Cloud services and deployment', 'inst009', 150),
      ('CS502', 'Mobile Development', 'cs502.jpg', 'Mobile app development', 'inst010', 100),
      ('MATH101', 'Calculus I', 'math101.jpg', 'Introduction to calculus', 'inst011', 100),
      ('MATH102', 'Linear Algebra', 'math102.jpg', 'Vector spaces and matrices', 'inst012', 100),
      ('PHYS101', 'Physics I', 'phys101.jpg', 'Mechanics and dynamics', 'inst013', 100),
      ('PHYS102', 'Physics II', 'phys102.jpg', 'Electricity and magnetism', 'inst014', 150),
      ('ENG101', 'Technical Writing', 'eng101.jpg', 'Professional communication', 'inst015', 100),
      ('BUS101', 'Business Computing', 'bus101.jpg', 'Business applications', 'inst016', 100),
      ('ART101', 'Digital Design', 'art101.jpg', 'Design principles', 'inst017', 100),
      ('STAT101', 'Statistics', 'stat101.jpg', 'Statistical analysis', 'inst018', 50),
      ('CHEM101', 'Chemistry', 'chem101.jpg', 'Basic chemistry concepts', 'inst019', 100),
      ('BIO101', 'Biology', 'bio101.jpg', 'Introduction to biology', 'inst020', 100);
    `);

    // Projects - 20 records
    await pool.query(`
      INSERT INTO Project (Project_Name, Course_Code, Start_Date, End_Date, Description, Max_team_size, max_grade) VALUES
      ('Web Portfolio', 'CS202', '2024-01-01', '2024-02-01', 'Create a personal portfolio website', 4, 20),
      ('Database Design', 'CS201', '2024-01-15', '2024-02-15', 'Design and implement a database system', 3, 20),
      ('Mobile App', 'CS502', '2024-02-01', '2024-03-01', 'Develop a mobile application', 4, 15),
      ('AI Project', 'CS302', '2024-02-15', '2024-03-15', 'Implement an AI algorithm', 3, 30),
      ('Network Protocol', 'CS401', '2024-03-01', '2024-04-01', 'Design a network protocol', 4, 10),
      ('Security Analysis', 'CS402', '2024-03-15', '2024-04-15', 'Perform security assessment', 3, 10),
      ('Cloud Service', 'CS501', '2024-04-01', '2024-05-01', 'Deploy a cloud application', 4, 15),
      ('Data Structure Implementation', 'CS102', '2024-04-15', '2024-05-15', 'Implement advanced data structures', 3, 25),
      ('Software Development', 'CS301', '2024-05-01', '2024-06-01', 'Develop a software application', 4, 20),
      ('Programming Basics', 'CS101', '2024-05-15', '2024-06-15', 'Create basic programs', 3, 15),
      ('Math Modeling', 'MATH101', '2024-06-01', '2024-07-01', 'Mathematical modeling project', 4, 20),
      ('Linear Systems', 'MATH102', '2024-06-15', '2024-07-15', 'Solve linear systems', 3, 10),
      ('Physics Simulation', 'PHYS101', '2024-07-01', '2024-08-01', 'Create physics simulations', 4, 15),
      ('Circuit Design', 'PHYS102', '2024-07-15', '2024-08-15', 'Design electrical circuits', 3, 20),
      ('Technical Documentation', 'ENG101', '2024-08-01', '2024-09-01', 'Create technical documents', 4, 25),
      ('Business Analysis', 'BUS101', '2024-08-15', '2024-09-15', 'Analyze business processes', 3, 10),
      ('Digital Art', 'ART101', '2024-09-01', '2024-10-01', 'Create digital artwork', 4, 15),
      ('Statistical Analysis', 'STAT101', '2024-09-15', '2024-10-15', 'Perform statistical analysis', 3, 20),
      ('Chemical Analysis', 'CHEM101', '2024-10-01', '2024-11-01', 'Analyze chemical compounds', 4, 25),
      ('Biological Research', 'BIO101', '2024-10-15', '2024-11-15', 'Conduct biological research', 3, 10);
    `);

    // Teams - 20 records
    await pool.query(`
      INSERT INTO Team (Project_ID, Team_Num, Team_Name) VALUES
      (1, 1, 'Web Warriors'),
      (1, 2, 'Code Crafters'),
      (2, 1, 'Data Miners'),
      (2, 2, 'Query Queens'),
      (3, 1, 'Mobile Masters'),
      (3, 2, 'App Artisans'),
      (4, 1, 'AI Innovators'),
      (4, 2, 'Neural Networks'),
      (5, 1, 'Network Ninjas'),
      (5, 2, 'Protocol Pros'),
      (6, 1, 'Security Squad'),
      (6, 2, 'Cyber Champions'),
      (7, 1, 'Cloud Commanders'),
      (7, 2, 'Deploy Dragons'),
      (8, 1, 'Structure Stars'),
      (8, 2, 'Algorithm Aces'),
      (9, 1, 'Software Savants'),
      (9, 2, 'Dev Dragons'),
      (10, 1, 'Code Cadets'),
      (10, 2, 'Binary Brigade');
    `);

    // Assignments - 20 records
    await pool.query(`
      INSERT INTO Assignment (Title, Max_grade, Description, Due_Date, Course_Code) VALUES
      ('HTML Basics', 5, 'Create a basic HTML webpage', '2024-01-15', 'CS202'),
      ('SQL Queries', 5, 'Write complex SQL queries', '2024-01-30', 'CS201'),
      ('Mobile UI Design', 5, 'Design a mobile app interface', '2024-02-15', 'CS502'),
      ('Neural Networks', 10, 'Implement a neural network', '2024-03-01', 'CS302'),
      ('Network Protocols', 5, 'Analyze network protocols', '2024-03-15', 'CS401'),
      ('Security Audit', 10, 'Perform a security audit', '2024-04-01', 'CS402'),
      ('Cloud Deployment', 10, 'Deploy a cloud application', '2024-04-15', 'CS501'),
      ('Binary Trees', 10, 'Implement a binary tree', '2024-05-01', 'CS102'),
      ('Software Testing', 15, 'Write unit tests', '2024-05-15', 'CS301'),
      ('Python Basics', 5, 'Basic Python programming', '2024-06-01', 'CS101'),
      ('Calculus Problems', 5, 'Solve calculus problems', '2024-06-15', 'MATH101'),
      ('Matrix Operations', 10, 'Perform matrix operations', '2024-07-01', 'MATH102'),
      ('Physics Problems', 10, 'Solve physics problems', '2024-07-15', 'PHYS101'),
      ('Circuit Analysis', 15, 'Analyze electrical circuits', '2024-08-01', 'PHYS102'),
      ('Technical Report', 2, 'Write a technical report', '2024-08-15', 'ENG101'),
      ('Business Case', 2, 'Analyze a business case', '2024-09-01', 'BUS101'),
      ('Digital Portfolio', 10, 'Create a digital portfolio', '2024-09-15', 'ART101'),
      ('Data Analysis', 5, 'Analyze statistical data', '2024-10-01', 'STAT101'),
      ('Chemical Equations', 5, 'Balance chemical equations', '2024-10-15', 'CHEM101'),
      ('Lab Report', 3, 'Write a biology lab report', '2024-11-01', 'BIO101');
    `);

    // Chat Groups - 20 records
    await pool.query(`
      INSERT INTO Chat_Group (Group_Name) VALUES
      ('Web Development Team'),
      ('Database Group'),
      ('Mobile Dev Team'),
      ('AI Research Group'),
      ('Network Security'),
      ('Cloud Computing'),
      ('Data Structures'),
      ('Software Engineering'),
      ('Programming Basics'),
      ('Mathematics Group'),
      ('Physics Study Group'),
      ('Chemistry Lab Group'),
      ('Biology Research'),
      ('Technical Writing'),
      ('Business Analytics'),
      ('Digital Arts'),
      ('Statistics Help'),
      ('Project Management'),
      ('Study Group Alpha'),
      ('Homework Help');
    `);

    // Channels - 40 records (2 channels per group)
    await pool.query(`
      INSERT INTO Channel (Channel_Name, Channel_Num, Group_ID, Channel_Type) VALUES
      ('General', 1, 1, 'open'),
      ('Resources', 2, 1, 'open'),
      ('Announcements', 1, 2, 'restricted'),
      ('Discussion', 2, 2, 'open'),
      ('Team Chat', 1, 3, 'open'),
      ('Project Updates', 2, 3, 'restricted'),
      ('Research', 1, 4, 'open'),
      ('Publications', 2, 4, 'open'),
      ('Security Alerts', 1, 5, 'restricted'),
      ('Best Practices', 2, 5, 'open'),
      ('Cloud Services', 1, 6, 'open'),
      ('Deployments', 2, 6, 'open'),
      ('Algorithms', 1, 7, 'open'),
      ('Code Review', 2, 7, 'open'),
      ('Sprint Planning', 1, 8, 'open'),
      ('Daily Standup', 2, 8, 'open'),
      ('Help Desk', 1, 9, 'open'),
      ('Resources', 2, 9, 'open'),
      ('Problem Solving', 1, 10, 'open'),
      ('Study Materials', 2, 10, 'open'),
      ('Lab Work', 1, 11, 'open'),
      ('Experiments', 2, 11, 'open'),
      ('Research Topics', 1, 12, 'open'),
      ('Lab Results', 2, 12, 'open'),
      ('Writing Help', 1, 13, 'open'),
      ('Document Review', 2, 13, 'open'),
      ('Case Studies', 1, 14, 'open'),
      ('Analysis', 2, 14, 'open'),
      ('Portfolio Review', 1, 15, 'open'),
      ('Inspiration', 2, 15, 'open'),
      ('Data Analysis', 1, 16, 'open'),
      ('Methods', 2, 16, 'open'),
      ('Project Planning', 1, 17, 'open'),
      ('Timeline', 2, 17, 'open'),
      ('Study Sessions', 1, 18, 'open'),
      ('Notes Sharing', 2, 18, 'open'),
      ('Questions', 1, 19, 'open'),
      ('Solutions', 2, 19, 'open'),
      ('General Help', 1, 20, 'open'),
      ('Resources', 2, 20, 'open');
    `);

    // Messages - 20 records
    await pool.query(`
      INSERT INTO Message (Channel_Num, Group_ID, Time_Stamp, Type, Content, sender_ID) VALUES
      (1, 1, '2024-01-01 10:00:00', 'announcement', 'Welcome to Web Development!', 'inst001'),
      (2, 1, '2024-01-01 10:30:00', 'message', 'Here are some useful resources', 'inst001'),
      (1, 2, '2024-01-02 09:00:00', 'announcement', 'Database project starting today', 'inst002'),
      (1, 3, '2024-01-02 14:00:00', 'message', 'Team meeting at 3 PM', 'stud001'),
      (2, 3, '2024-01-03 11:00:00', 'update', 'Project milestone completed', 'stud002'),
      (1, 4, '2024-01-03 13:00:00', 'announcement', 'New research paper published', 'inst003'),
      (1, 5, '2024-01-04 10:00:00', 'alert', 'Security update required', 'inst004'),
      (2, 5, '2024-01-04 15:00:00', 'message', 'Implementation guidelines', 'stud003'),
      (1, 6, '2024-01-05 09:00:00', 'announcement', 'New cloud service available', 'inst005'),
      (2, 6, '2024-01-05 14:00:00', 'update', 'Deployment successful', 'stud004'),
      (1, 7, '2024-01-06 10:00:00', 'message', 'Algorithm discussion today', 'inst006'),
      (1, 8, '2024-01-06 11:00:00', 'announcement', 'Sprint review at 2 PM', 'inst007'),
      (1, 9, '2024-01-07 09:00:00', 'message', 'Need help with Python?', 'stud005'),
      (1, 10, '2024-01-07 13:00:00', 'resource', 'Math problem set solutions', 'inst008'),
      (1, 11, '2024-01-08 10:00:00', 'announcement', 'Lab safety reminder', 'inst009'),
      (1, 12, '2024-01-08 14:00:00', 'update', 'Research findings posted', 'inst010'),
      (1, 13, '2024-01-09 09:00:00', 'message', 'Writing workshop today', 'stud006'),
      (1, 14, '2024-01-09 11:00:00', 'resource', 'Business case templates', 'stud007'),
      (1, 15, '2024-01-10 10:00:00', 'announcement', 'Portfolio deadline extended', 'stud008'),
      (1, 16, '2024-01-10 15:00:00', 'message', 'Statistical analysis help needed', 'stud009');
    `);

    // Badges - 7 records
    await pool.query(`
      INSERT INTO Badge (Picture, Title, Description) VALUES
      ('top_project_performer.png', 'Top Project Performer', 'Achieved the highest rates in a project'),
      ('project_excellence.png', 'Project Excellence Award Gold', 'Achieved the highest rates across all projects'),
      ('project_excellence.png', 'Project Excellence Award Silver', 'Achieved the second highest rates across all projects'),
      ('course_champion.png', 'Course Champion Gold', 'Achieved the highest grades in a course'),
      ('academic_all_star.png', 'Academic All-Star Gold', 'Achieved the highest grades across all courses'),
      ('academic_all_star.png', 'Academic All-Star Silver', 'Achieved the second highest grades across all courses'),
      ('instructor_choice.png', 'Instructor Choice', 'A special badge awarded to a student chosen by an instructor');
    `);

    // Enrollments
    await pool.query(`
      INSERT INTO enrollment (student_ID, Course_Code)
      SELECT
        u.user_id,
        c.course_code
      FROM
        users u
        CROSS JOIN course c
      WHERE
        u.role = 'student'
      ORDER BY
        u.user_id, c.course_code;
    `);


    //Participation - 20 records
    await pool.query(`
      INSERT INTO participation (student_ID, Project_ID, Team_Num, Leader) VALUES
      ('stud001', 1, 1, true),
      ('stud002', 1, 1, false),
      ('stud003', 2, 1, true),
      ('stud004', 2, 1, false),
      ('stud005', 3, 1, false),
      ('stud006', 3, 1, false),
      ('stud007', 4, 1, true),
      ('stud008', 4, 1, false),
      ('stud009', 5, 1, true),
      ('stud010', 5, 1, false),
      ('stud011', 6, 1, true),
      ('stud012', 6, 1, false),
      ('stud013', 7, 1, true),
      ('stud014', 7, 1, false),
      ('stud015', 8, 1, true),
      ('stud011', 6, 2, true),
      ('stud012', 7, 2, true),
      ('stud013', 8, 2, true),
      ('stud014', 9, 2, true),
      ('stud015', 10, 2, true);
    `);

    // Submissions - 10 records
    await pool.query(`
      INSERT INTO Submission (Type, Student_ID, Grade, Submission_date) VALUES
      ('assignment', 'stud001', 95, '2024-01-15'),
      ('phase', 'stud002', 88, '2024-01-20'),
      ('assignment', 'stud003', 92, '2024-01-25'),
      ('phase', 'stud004', 85, '2024-02-01'),
      ('assignment', 'stud005', 90, '2024-02-05'),
      ('phase', 'stud006', 87, '2024-02-10'),
      ('assignment', 'stud007', 94, '2024-02-15'),
      ('phase', 'stud008', 89, '2024-02-20'),
      ('assignment', 'stud009', 91, '2024-02-25'),
      ('phase', 'stud010', 86, '2024-03-01');
    `);

    // Phase - 10 records (for different projects)
    await pool.query(`
      INSERT INTO Phase (Project_ID, Phase_Num, Phase_Name, Phase_load, deadline, description) VALUES
      (1, 1, 'Planning', 20, '2024-02-01', 'Initial planning and requirements gathering'),
      (1, 2, 'Development', 40, '2024-03-01', 'Core development phase'),
      (2, 1, 'Design', 30, '2024-02-15', 'Database design and architecture'),
      (2, 2, 'Implementation', 50, '2024-03-15', 'Database implementation'),
      (3, 1, 'Research', 25, '2024-02-10', 'Market research and analysis'),
      (3, 2, 'Prototyping', 35, '2024-03-10', 'Creating initial prototypes'),
      (4, 1, 'Analysis', 30, '2024-02-20', 'Problem analysis phase'),
      (4, 2, 'Solution Design', 45, '2024-03-20', 'Designing the solution'),
      (5, 1, 'Requirements', 20, '2024-02-25', 'Gathering requirements'),
      (5, 2, 'Architecture', 40, '2024-03-25', 'System architecture design');
    `);

    // PhaseSubmission - 5 records
    await pool.query(`
      INSERT INTO PhaseSubmission (Submission_ID, Project_ID, Phase_Num) VALUES
      (2, 1, 1),
      (4, 1, 2),
      (6, 2, 1),
      (8, 2, 2),
      (10, 5, 2);
    `);

    // Review - 10 records
    await pool.query(`
      INSERT INTO Review (Reviewer_ID, Reviewee_ID, Project_ID, Content, Rating) VALUES
      ('stud001', 'stud002', 1, 'Great teamwork and communication skills', 5),
      ('stud002', 'stud003', 1, 'Excellent technical contributions', 4),
      ('stud003', 'stud004', 2, 'Very helpful and knowledgeable', 3),
      ('stud004', 'stud005', 2, 'Good problem-solving abilities', 4),
      ('stud005', 'stud006', 3, 'Strong leadership qualities', 3),
      ('stud006', 'stud007', 3, 'Reliable team member', 4),
      ('stud007', 'stud008', 4, 'Outstanding coding skills', 5),
      ('stud008', 'stud009', 4, 'Great attention to detail', 3),
      ('stud009', 'stud010', 5, 'Excellent project management', 5),
      ('stud010', 'stud001', 5, 'Innovative problem solver', 4);
    `);

    // MessageRead - 10 records
    await pool.query(`
      INSERT INTO MessageRead (LastMessageRead_ID, User_ID, ReadAt) VALUES
      (1, 'stud001', '2024-01-01 12:00:00'),
      (2, 'stud002', '2024-01-02 13:00:00'),
      (3, 'stud003', '2024-01-03 14:00:00'),
      (4, 'stud004', '2024-01-04 15:00:00'),
      (5, 'stud005', '2024-01-05 16:00:00'),
      (6, 'stud006', '2024-01-06 17:00:00'),
      (7, 'stud007', '2024-01-07 18:00:00'),
      (8, 'stud008', '2024-01-08 19:00:00'),
      (9, 'stud009', '2024-01-09 20:00:00'),
      (10, 'stud010', '2024-01-10 21:00:00');
    `);

    // EarnedBadges - 10 records
    await pool.query(`
      INSERT INTO EarnedBadges (Student_ID, Badge_ID, Earned_at) VALUES 
      ('stud001', 1, '2024-01-15'),
      ('stud002', 2, '2024-01-20'),
      ('stud003', 3, '2024-01-25'),
      ('stud004', 4, '2024-02-01'),
      ('stud005', 5, '2024-02-05'),
      ('stud006', 6, '2024-02-10'),
      ('stud007', 7, '2024-02-15');      
    `);

    //Adding relevant technologies for each team based on their project context
    await pool.query(`
  INSERT INTO Technology (Project_ID, Team_Num, Technology) VALUES
  -- Web Portfolio teams (Project 1)
      (1, 1, 'React'),
      (1, 1, 'TypeScript'),
      (1, 1, 'Tailwind CSS'),
      (1, 2, 'Vue.js'),
      (1, 2, 'JavaScript'),
      (1, 2, 'SCSS'),

  -- Database Design teams (Project 2)
      (2, 1, 'PostgreSQL'),
      (2, 1, 'MongoDB'),
      (2, 1, 'Redis'),
      (2, 2, 'MySQL'),
      (2, 2, 'Docker'),
      (2, 2, 'Prisma'),

  -- Mobile App teams (Project 3)
      (3, 1, 'React Native'),
      (3, 1, 'Firebase'),
      (3, 1, 'TypeScript'),
      (3, 2, 'Flutter'),
      (3, 2, 'Dart'),
      (3, 2, 'SQLite'),

  -- AI Project teams (Project 4)
      (4, 1, 'Python'),
      (4, 1, 'TensorFlow'),
      (4, 1, 'scikit-learn'),
      (4, 2, 'PyTorch'),
      (4, 2, 'Pandas'),
      (4, 2, 'NumPy'),

  -- Network Protocol teams (Project 5)
      (5, 1, 'Python'),
      (5, 1, 'Socket.io'),
      (5, 1, 'Wireshark'),
      (5, 2, 'Node.js'),
      (5, 2, 'TCP/IP'),
      (5, 2, 'gRPC'),

   -- Security Analysis teams (Project 6)
      (6, 1, 'Kali Linux'),
      (6, 1, 'Metasploit'),
      (6, 1, 'Burp Suite'),
      (6, 2, 'Python'),
      (6, 2, 'Nmap'),
      (6, 2, 'OWASP ZAP'),

   -- Cloud Service teams (Project 7)
      (7, 1, 'AWS'),
      (7, 1, 'Docker'),
      (7, 1, 'Kubernetes'),
      (7, 2, 'Azure'),
      (7, 2, 'Terraform'),
      (7, 2, 'Jenkins'),

   -- Data Structure Implementation teams (Project 8)
      (8, 1, 'Java'),
      (8, 1, 'JUnit'),
      (8, 1, 'Maven'),
      (8, 2, 'C++'),
      (8, 2, 'CMake'),
      (8, 2, 'Google Test'),

   -- Software Development teams (Project 9)
      (9, 1, 'Java'),
      (9, 1, 'Spring Boot'),
      (9, 1, 'PostgreSQL'),
      (9, 2, 'Python'),
      (9, 2, 'Django'),
      (9, 2, 'Redis'),

   -- Programming Basics teams (Project 10)
      (10, 1, 'Python'),
      (10, 1, 'JavaScript'),
      (10, 1, 'HTML/CSS'),
      (10, 2, 'Java'),
      (10, 2, 'SQL'),
      (10, 2, 'Git');
`);

    await pool.end();
    console.log("Disconnected from database");
    console.log("Sample data inserted successfully");
  } catch (err) {
    console.error("Error inserting sample data:", err);
  }
}
insertSampleData();
