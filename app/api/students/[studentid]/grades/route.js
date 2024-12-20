import pool from "@/lib/db";
import {NextResponse} from "next/server";

export async function GET(request, {params}) {
    try {
        const par = await params;

        // Fetch courses the student is enrolled in
        const courses = await pool.query(`
      SELECT course.course_code, Course.course_name, max_grade
      FROM Course      
    `);

        // Fetch grades for assignments and projects
        const coursesWithGrades = await Promise.all(courses.rows.map(async (course) => {
            // Fetch assignment grades
            const assignments = await pool.query(`
        SELECT Assignment.assignment_id, Assignment.title, Submission.grade AS grade, Assignment.max_grade
        FROM Assignment
        LEFT JOIN Assignmentsubmission ON Assignment.assignment_id = Assignmentsubmission.assignment_id
        LEFT JOIN Submission ON Assignmentsubmission.Submission_id = Submission.Submission_id AND Submission.student_id = $2
        WHERE Assignment.course_code = $1 AND grade IS NOT NULL;
      `, [course.course_code, par.studentid]);

            let assignmentsGrades = {};
            if (assignments.rowCount > 0) {
                const total_assignments = await pool.query(`
             SELECT SUM(Submission.grade) AS total_assign
             FROM Assignment
             LEFT JOIN Assignmentsubmission ON Assignment.assignment_id = Assignmentsubmission.assignment_id
             LEFT JOIN Submission ON Assignmentsubmission.Submission_id = Submission.Submission_id AND Submission.student_id = $2
             WHERE Assignment.course_code = $1 AND Submission.grade IS NOT NULL;
            `, [course.course_code, par.studentid]);
                assignmentsGrades = {
                    assignments: assignments.rows, ...total_assignments.rows[0],
                };
            }

            // Fetch current project
            const currProject = await pool.query(`
          SELECT Project.project_id, Project.project_name, Project.max_grade
          FROM Project
          WHERE Project.course_code = $1
          ORDER BY Project.start_date DESC LIMIT 1;
          `, [course.course_code]);

            let projectGrades = {};
            if (currProject.rowCount > 0) {
                const project = currProject.rows[0];

                // Fetch project phases grades
                const projectPhases = await pool.query(`
              SELECT Phase.phase_num, Phase.phase_name AS title, Submission.grade AS grade, Phase.phase_load,
              (Phase.phase_load * $3 /100) AS max_grade_per_phase
              FROM Phase
              LEFT JOIN phasesubmission ON Phase.phase_num = phasesubmission.phase_num AND Phase.project_id = phasesubmission.project_id
              LEFT JOIN Submission ON phasesubmission.Submission_id = Submission.Submission_id AND Submission.student_id = $1
              WHERE Phase.project_id = $2 AND grade IS NOT NULL;
            `, [par.studentid, project.project_id, project.max_grade]);

                const total = await pool.query(`
              SELECT COALESCE(SUM(COALESCE(Submission.grade, 0)), 0) AS total_project
              FROM Phase
              LEFT JOIN phasesubmission ON Phase.phase_num = phasesubmission.phase_num AND Phase.project_id = phasesubmission.project_id
              LEFT JOIN Submission ON phasesubmission.Submission_id = Submission.Submission_id AND Submission.student_id = $1
              WHERE Phase.project_id = $2 AND Submission.grade IS NOT NULL;
            `, [par.studentid, project.project_id]);

                projectGrades = {
                    project_id: project.project_id,
                    title: project.project_name,
                    max_grade: project.max_grade,
                    phases: projectPhases.rows, ...total.rows[0],
                };
            }

            return {
                course_code: course.course_code,
                course_name: course.course_name,
                course_max_grade: course.max_grade,
                assignmentsGrades,
                projectGrades,
                total_grade: (parseFloat(projectGrades.total_project) || 0) + parseFloat(assignmentsGrades.total_assign || 0),
            };
        }));

        return NextResponse.json(coursesWithGrades, {status: 200});
    } catch (error) {
        console.error("Error fetching student courses and grades:", error);
        return NextResponse.json({error: "Failed to fetch courses and grades"}, {status: 500});
    }
}
