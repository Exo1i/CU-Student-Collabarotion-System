import pool from "@/lib/db";
import {NextResponse} from "next/server";

// Get course details including instructor, the single project with phases and submissions, and assignments with submissions
export async function GET(request, { params }) {
  try {
    const par = await params;

    // Fetch instructor and course details
    const instructor = await pool.query(
      `
      SELECT c.course_code, c.course_name, c.course_img, COALESCE(c.description, '') AS course_description, 
             COALESCE(c.max_grade, 0) AS max_grade, c.instructor_id, CONCAT(u.fname, ' ', u.lname) AS full_name, u.img_url
      FROM Course c
      JOIN Users u ON c.instructor_id = u.user_id
      WHERE c.instructor_id = $1;
    `,
      [par.instructorID]
    );

    if (instructor.rowCount === 0) {
      return NextResponse.json(
        { error: "Instructor or course not found" },
        { status: 404 }
      );
    }
    const course = instructor.rows[0];

    // Fetch the single project for the course
    const projectResult = await pool.query(
      `
      SELECT p.project_id, p.project_name, COALESCE(p.start_date::TEXT, '') AS start_date, 
      COALESCE(p.end_date::TEXT, '') AS end_date, COALESCE(p.description, '') AS description, 
      COALESCE(p.max_team_size, 0) AS max_team_size, COALESCE(p.max_grade, 0) AS max_grade
      FROM Project p
      WHERE p.course_code = $1;
    `,
      [course.course_code]
    );
    const project = projectResult.rowCount > 0 ? projectResult.rows[0] : {};

    if (project.project_id) {
      // Fetch phases for the project
      const phasesResult = await pool.query(
        `
        SELECT ph.phase_num, ph.phase_name, COALESCE(ph.deadline::TEXT, '') AS deadline, 
               COALESCE(ph.phase_load, 0) AS phase_load, COALESCE(ph.description, '') AS description
        FROM Phase ph
        WHERE ph.project_id = $1;
      `,
        [project.project_id]
      );
      const phases = await Promise.all(
        phasesResult.rows.map(async (phase) => {
          // Fetch submissions for each phase
          const submissionsResult = await pool.query(
            `
            SELECT s.submission_id, COALESCE(s.submission_date::TEXT, '') AS submission_date, 
                   COALESCE(s.grade, 0) AS grade, s.student_id, CONCAT(u.fname, ' ', u.lname) AS student_name
            FROM Submission s
            JOIN PhaseSubmission ps ON s.submission_id = ps.submission_id
            JOIN Users u ON s.student_id = u.user_id
            WHERE ps.phase_num = $1 AND ps.project_id = $2;
          `,
            [phase.phase_num, project.project_id]
          );
          return {
            ...phase,
            submissions: submissionsResult.rows,
          };
        })
      );
      project.phases = phases;
    }

    // Fetch assignments for the course
    const assignmentsResult = await pool.query(
      `
      SELECT a.assignment_id, a.title, COALESCE(a.due_date::TEXT, '') AS due_date, COALESCE(a.description, '') AS description, 
             COALESCE(a.max_grade, 0) AS max_grade
      FROM Assignment a
      WHERE a.course_code = $1;
    `,
      [course.course_code]
    );

    const assignments = await Promise.all(
      assignmentsResult.rows.map(async (assignment) => {
        // Fetch submissions for each assignment
        const submissionsResult = await pool.query(
          `
          SELECT s.submission_id, COALESCE(s.submission_date::TEXT, '') AS submission_date, 
                 COALESCE(s.grade, 0) AS grade, s.student_id, CONCAT(u.fname, ' ', u.lname) AS student_name
          FROM Submission s
          JOIN AssignmentSubmission asub ON s.submission_id = asub.submission_id
          JOIN Users u ON s.student_id = u.user_id
          WHERE asub.assignment_id = $1;
        `,
          [assignment.assignment_id]
        );
        return {
          ...assignment,
          submissions: submissionsResult.rows,
        };
      })
    );

    const response = {
      instructor: {
        instructor_id: course.instructor_id,
        full_name: course.full_name,
        img_url: course.img_url,
      },
      course: {
        course_code: course.course_code,
        course_name: course.course_name,
        course_img: course.course_img,
        course_description: course.course_description,
        max_grade: course.max_grade,
        project: project,
        assignments: assignments,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching instructor details:", error);
    return NextResponse.json(
      { error: "Failed to fetch instructor details" },
      { status: 500 }
    );
  }
}
