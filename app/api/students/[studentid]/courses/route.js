import pool from "@/lib/db";
import {NextResponse} from "next/server";

export async function GET(request, { params }) {
  try {
    const par = await params;

    // Fetch courses the student is enrolled in
    const courses = await pool.query(
      `
      SELECT Enrollment.course_code, course.course_name
      FROM Enrollment JOIN Course ON Enrollment.course_code= Course.course_code
      WHERE Enrollment.student_id = $1;
    `,
      [par.studentid]
    );

    // Fetch grades for assignments and projects
    const coursesWithGrades = await Promise.all(
      courses.rows.map(async (course) => {
        // Fetch assignment grades
        const assignments = await pool.query(
          `
        SELECT Assignment.assignment_id, Assignment.title, COALESCE(Submission.grade, 0) AS grade, assignment.max_grade
        FROM Assignmentsubmission
        inner join assignment ON Assignmentsubmission.assignment_id = Assignment.assignment_id
        inner join submission on Assignmentsubmission.Submission_id = submission.Submission_id
        WHERE Assignment.course_code = $1 AND submission.student_id = $2;
      `,
          [course.course_code, par.studentid]
        );

        const total_assignemts = await pool.query(
          `
           SELECT sum(COALESCE(Submission.grade, 0)) as total_assign
           FROM Assignmentsubmission
           inner join assignment ON Assignmentsubmission.assignment_id = Assignment.assignment_id
           inner join submission on Assignmentsubmission.Submission_id = submission.Submission_id
           WHERE Assignment.course_code = $1 AND submission.student_id = $2;`,
          [course.course_code, par.studentid]
        );

        let assignmentsGrades = [];
        assignmentsGrades = {
          assignments: assignments.rows,
          ...total_assignemts.rows[0],
        };

        // Fetch current project
        const currProject = await pool.query(
          `
          SELECT Project.project_id, Project.project_name, Project.max_grade
          FROM Project
          WHERE Project.course_code = $1
          ORDER BY Project.start_date DESC LIMIT 1;
          `,
          [course.course_code]
        );

        let projectGrades = [];
        if (currProject.rowCount > 0) {
          const project = currProject.rows[0];

          // Fetch project phases grades
          const projectPhases = await pool.query(
            `
              SELECT phase.phase_num, phase.phase_name as title, COALESCE(Submission.grade, 0) AS grade
              FROM phasesubmission
              inner join phase ON phasesubmission.phase_num = phase.phase_num
              inner join submission on phasesubmission.Submission_id = submission.Submission_id
              WHERE submission.student_id = $1 And phase.project_id = $2;
            `,
            [par.studentid, project.project_id]
          );

          const total = await pool.query(
            `
              SELECT sum(COALESCE(Submission.grade, 0)) as total_project
              FROM phasesubmission
              INNER JOIN phase ON phasesubmission.phase_num = phase.phase_num AND phasesubmission.project_id = phase.project_id
              INNER JOIN submission ON phasesubmission.Submission_id = submission.Submission_id
              WHERE submission.student_id = $1 AND phase.project_id = $2
            `,
            [par.studentid, project.project_id]
          );

          projectGrades = {
            project_id: project.project_id,
            title: project.title,
            max_grade: project.max_grade,
            phases: projectPhases.rows,
            ...total.rows[0],
          };
        }

        return {
          course_code: course.course_code,
          course_name: course.course_name,
          assignmentsGrades,
          projectGrades,
          total_grade:
            (parseFloat(projectGrades.total_project) || 0) +
            parseFloat(assignmentsGrades.total_assign || 0),
        };
      })
    );

    return NextResponse.json(coursesWithGrades, { status: 200 });
  } catch (error) {
    console.error("Error fetching student courses and grades:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses and grades" },
      { status: 500 }
    );
  }
}
