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

        // Create schema if not exists
        await pool.query(`CREATE SCHEMA IF NOT EXISTS public;`);

        // Create sequences if not exists
        await pool.query(`
      CREATE SEQUENCE IF NOT EXISTS message_message_id_seq;
      CREATE SEQUENCE IF NOT EXISTS attachment_attachment_id_seq;
      CREATE SEQUENCE IF NOT EXISTS chat_group_seq;
      CREATE SEQUENCE IF NOT EXISTS project_project_id_seq;
      CREATE SEQUENCE IF NOT EXISTS assignment_assignment_id_seq;
      CREATE SEQUENCE IF NOT EXISTS badge_badge_id_seq;
      CREATE SEQUENCE IF NOT EXISTS submission_submission_id_seq;
    `);

        // Create users table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.users (
        user_id VARCHAR(32) PRIMARY KEY,
        username TEXT,
        fname TEXT NOT NULL, 
        lname TEXT NOT NULL,
        role TEXT NOT NULL,
        img_url TEXT
      );
    `);

        // Create courses table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.course (
        course_code VARCHAR(10) PRIMARY KEY,
        course_name TEXT NOT NULL,
        course_img TEXT,
        instructor_id VARCHAR(32),
        max_grade INTEGER NOT NULL,
        description TEXT,
        FOREIGN KEY (instructor_id) REFERENCES public.users (user_id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

        // Create projects table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.project (
        project_id INTEGER NOT NULL DEFAULT nextval('project_project_id_seq') PRIMARY KEY,
        project_name TEXT NOT NULL,
        course_code VARCHAR(10),
        start_date DATE DEFAULT CURRENT_DATE,
        end_date DATE,
        description TEXT,
        max_team_size INTEGER,
        max_grade INTEGER,
        FOREIGN KEY (course_code) REFERENCES public.course (course_code) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

        // Create phase table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.phase (
        project_id INTEGER,
        phase_num INTEGER,
        phase_name TEXT,
        description TEXT,
        phase_load INTEGER NOT NULL,
        deadline DATE,
        PRIMARY KEY (project_id, phase_num),
        FOREIGN KEY (project_id) REFERENCES public.project (project_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // Create team table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.team (
        project_id INTEGER,
        team_num INTEGER,
        team_name TEXT,
        PRIMARY KEY (project_id, team_num),
        FOREIGN KEY (project_id) REFERENCES public.project (project_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // Create chat_group table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.chat_group (
        group_id INTEGER NOT NULL DEFAULT nextval('chat_group_seq') PRIMARY KEY,
        group_name TEXT NOT NULL
      );
    `);

        // Create channel table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.channel (
        channel_name TEXT NOT NULL,
        channel_num INTEGER,
        group_id INTEGER,
        channel_type TEXT NOT NULL,
        PRIMARY KEY (channel_num, group_id),
        FOREIGN KEY (group_id) REFERENCES public.chat_group (group_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // Create message table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.message (
        message_id INTEGER NOT NULL DEFAULT nextval('message_message_id_seq') PRIMARY KEY,
        channel_num INTEGER,
        group_id INTEGER,
        time_stamp TIMESTAMP DEFAULT NOW(),
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        sender_id VARCHAR(32),
        FOREIGN KEY (sender_id) REFERENCES public.users (user_id),
        FOREIGN KEY (channel_num, group_id) REFERENCES public.channel (channel_num, group_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS public_message_pkey ON public.message (message_id);
    `);

        // Create assignment table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.assignment (
        assignment_id INTEGER NOT NULL DEFAULT nextval('assignment_assignment_id_seq') PRIMARY KEY,
        title TEXT NOT NULL,
        max_grade INTEGER NOT NULL,
        description TEXT,
        due_date DATE,
        course_code VARCHAR(10),
        FOREIGN KEY (course_code) REFERENCES public.course (course_code) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // Create submission table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.submission (
        submission_id INTEGER NOT NULL DEFAULT nextval('submission_submission_id_seq') PRIMARY KEY,
        URL TEXT, 
        type TEXT NOT NULL,
        student_id VARCHAR(32) NOT NULL,
        grade INTEGER,
        submission_date DATE DEFAULT NOW(),
        FOREIGN KEY (student_id) REFERENCES public.users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // Create badge table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.badge (
        badge_id INTEGER NOT NULL DEFAULT nextval('badge_badge_id_seq') PRIMARY KEY,
        picture TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT
      );
    `);

        // Create participation table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.participation (
        student_id VARCHAR(32),
        project_id INTEGER,
        team_num INTEGER,
        leader BOOLEAN,
        PRIMARY KEY (student_id, project_id, team_num),
        FOREIGN KEY (project_id, team_num) REFERENCES public.team (project_id, team_num) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (student_id) REFERENCES public.users (user_id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

        // Create enrollment table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.enrollment (
        student_id VARCHAR(32), 
        course_code VARCHAR(10),
        PRIMARY KEY (student_id, course_code),
        FOREIGN KEY (course_code) REFERENCES public.course (course_code) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (student_id) REFERENCES public.users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // Create messageRead table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.messageread (
        lastmessageread_id INTEGER,
        user_id VARCHAR(32),
        readat TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (lastmessageread_id, user_id),
        FOREIGN KEY (lastmessageread_id) REFERENCES public.message (message_id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (user_id) REFERENCES public.users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // Create phaseSubmission table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.phasesubmission (
        submission_id INTEGER,
        project_id INTEGER,
        phase_num INTEGER,
        PRIMARY KEY (submission_id, project_id, phase_num),
        FOREIGN KEY (submission_id) REFERENCES public.submission (submission_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (project_id, phase_num) REFERENCES public.phase (project_id, phase_num) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // Create assignmentSubmission table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.assignmentsubmission (
        submission_id INTEGER,
        assignment_id INTEGER,
        PRIMARY KEY (submission_id, assignment_id),
        FOREIGN KEY (assignment_id) REFERENCES public.assignment (assignment_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (submission_id) REFERENCES public.submission (submission_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // Create reviews table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.review (
        reviewer_id VARCHAR(32),
        reviewee_id VARCHAR(32),
        project_id INTEGER,
        content TEXT,
        rating INTEGER,
        PRIMARY KEY (reviewer_id, reviewee_id, project_id),
        FOREIGN KEY (project_id) REFERENCES public.project (project_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (reviewer_id) REFERENCES public.users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (reviewee_id) REFERENCES public.users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // Create earnedbadges table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.earnedbadges (
        student_id VARCHAR(32),
        badge_id INTEGER,
        earned_at DATE DEFAULT CURRENT_DATE,
        PRIMARY KEY (student_id, badge_id),
        FOREIGN KEY (badge_id) REFERENCES public.badge (badge_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (student_id) REFERENCES public.users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // Create technologies table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS public.technology (
        project_id INTEGER NOT NULL,
        team_num INTEGER NOT NULL,
        technology TEXT NOT NULL,
        PRIMARY KEY (project_id, team_num, technology),
        FOREIGN KEY (project_id, team_num) REFERENCES public.team (project_id, team_num) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        console.log("Tables created.");

        await pool.query(`
            -- First, create trigger function for enrolling new students in all courses
        CREATE OR REPLACE FUNCTION enroll_new_student()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Check if the new user is a student
            IF NEW.role = 'student' THEN
                -- Insert enrollment records for all existing courses
                INSERT INTO public.enrollment (student_id, course_code)
                SELECT NEW.user_id, course.course_code
                FROM public.course
                ON CONFLICT DO NOTHING; -- Avoid duplicate enrollments
            END IF;
            RETURN NEW;
        END;
            $$ LANGUAGE plpgsql;
        
        -- Create trigger for new student enrollments
        DROP TRIGGER IF EXISTS student_enrollment_trigger ON public.users;
        CREATE TRIGGER student_enrollment_trigger
            AFTER INSERT ON public.users
            FOR EACH ROW
            EXECUTE FUNCTION enroll_new_student();
        
        -- Create trigger function for enrolling all students in new courses
        CREATE OR REPLACE FUNCTION enroll_all_students_in_new_course()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Insert enrollment records for all existing students
            INSERT INTO public.enrollment (student_id, course_code)
            SELECT users.user_id, NEW.course_code
            FROM public.users
            WHERE users.role = 'student'
            ON CONFLICT DO NOTHING; -- Avoid duplicate enrollments
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        -- Create trigger for new course enrollments
        DROP TRIGGER IF EXISTS course_enrollment_trigger ON public.course;
        CREATE TRIGGER course_enrollment_trigger
            AFTER INSERT ON public.course
            FOR EACH ROW
            EXECUTE FUNCTION enroll_all_students_in_new_course();
    `)
        await pool.query(`
                    
                    -- Create trigger function for syncing team grades
            CREATE OR REPLACE FUNCTION sync_team_phase_grades()
            RETURNS TRIGGER AS $$
            DECLARE
                v_project_id INTEGER;
                v_team_num INTEGER;
                v_phase_num INTEGER;
                v_student_id VARCHAR(32);
            BEGIN
                -- Only proceed if grade has been updated
                IF NEW.grade IS NOT NULL AND (OLD.grade IS NULL OR NEW.grade != OLD.grade) THEN
                    -- Get project_id and phase_num from phasesubmission
                    SELECT project_id, phase_num 
                    INTO v_project_id, v_phase_num
                    FROM public.phasesubmission 
                    WHERE submission_id = NEW.submission_id;
            
                    IF v_project_id IS NOT NULL THEN  -- Only proceed if this is a phase submission
                        -- Get team_num for the student who submitted
                        SELECT team_num 
                        INTO v_team_num
                        FROM public.participation 
                        WHERE student_id = NEW.student_id
                        AND project_id = v_project_id;
            
                        -- Update or create submissions for all team members
                        FOR v_student_id IN (
                            SELECT student_id 
                            FROM public.participation
                            WHERE project_id = v_project_id 
                            AND team_num = v_team_num
                            AND student_id != NEW.student_id
                        ) LOOP
                            -- Try to update existing submission first
                            UPDATE public.submission s
                            SET grade = NEW.grade
                            FROM public.phasesubmission ps
                            WHERE s.submission_id = ps.submission_id
                            AND ps.project_id = v_project_id
                            AND ps.phase_num = v_phase_num
                            AND s.student_id = v_student_id;
                            
                            -- If no submission exists, create one
                            IF NOT FOUND THEN
                                WITH new_submission AS (
                                    INSERT INTO public.submission (
                                        submissionurl,
                                        type,
                                        student_id,
                                        grade,
                                        submission_date
                                    )
                                    VALUES (
                                        NEW.submissionurl,
                                        NEW.type,
                                        v_student_id,
                                        NEW.grade,
                                        NEW.submission_date
                                    )
                                    RETURNING submission_id
                                )
                                INSERT INTO public.phasesubmission (submission_id, project_id, phase_num)
                                SELECT submission_id, v_project_id, v_phase_num
                                FROM new_submission;
                            END IF;
                        END LOOP;
                    END IF;
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            
            -- Create the trigger
            DROP TRIGGER IF EXISTS sync_phase_grades_trigger ON public.submission;
            CREATE TRIGGER sync_phase_grades_trigger
                AFTER UPDATE ON public.submission
                FOR EACH ROW
                EXECUTE FUNCTION sync_team_phase_grades();
    `)
        console.log('Triggers created');
        await pool.end();
        console.log("Disconnected from database.");
    } catch (err) {
        console.error("Error initializing database:", err);
    }
    
}

initializeDB();
