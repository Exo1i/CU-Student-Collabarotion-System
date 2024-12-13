import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const par = await params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    // Get assignments deadlines along with course names
    const assignmentsQuery = `
      SELECT assignment.assignment_id, assignment.title, COALESCE(assignment.max_grade,0) AS max_grade, COALESCE(assignment.due_date::TEXT, ''), 'assignment' AS type, course.course_name
      FROM Assignment
      JOIN Course ON Assignment.course_code = Course.course_code
      ${date ? "WHERE assignment.due_date = $1" : ""}
    `;
    const assignments = await pool.query(assignmentsQuery, date ? [date] : []);

    const assignmentres = await Promise.all(
      assignments.rows.map(async (assignment) => {
        const submissions = await pool.query(
          `
           SELECT submission_date
           FROM Submission
           JOIN AssignmentSubmission ON Submission.Submission_id = AssignmentSubmission.Submission_id
           WHERE AssignmentSubmission.assignment_id = $1 AND student_id = $2;
        `,
          [assignment.assignment_id, par.studentid]
        );

        let submissionDate = null;
        if (submissions.rowCount > 0) {
          submissionDate = submissions.rows[0].submission_date;
        }

        let status;
        if (!submissionDate) {
          status = "missed";
        } else if (new Date(submissionDate) <= new Date(assignment.due_date)) {
          status = "done";
        } else {
          status = "late";
        }

        return {
          assign_id: assignment.assignment_id,
          name: assignment.title,
          max_grade: assignment.max_grade,
          due_date: assignment.due_date,
          type: "assignment",
          course_name: assignment.course_name,
          status: status,
        };
      })
    );

    // Get phases deadlines
    const phasesQuery = `
     SELECT
     phase.project_id,
     phase_num,
     phase_name,
     COALESCE(phase.deadline::TEXT, '') AS deadline,
     'phase' AS type,
     COALESCE(project.max_grade, 0) * COALESCE(phase.phase_load, 0) / 100 AS max_grade
     FROM Phase
     JOIN Project ON Project.project_id = Phase.project_id;
     ${date ? "WHERE deadline = $1" : ""}
    `;
    const phases = await pool.query(phasesQuery, date ? [date] : []);

    const phasesres = await Promise.all(
      phases.rows.map(async (phase) => {
        const submissions = await pool.query(
          `
            SELECT submission_date
            FROM Submission
            JOIN PhaseSubmission ON Submission.submission_id = PhaseSubmission.submission_id
            WHERE phase_num = $1 AND project_id = $2 AND student_id = $3;
        `,
          [phase.phase_num, phase.project_id, par.studentid]
        );

        let submissionDate = null;
        if (submissions.rowCount > 0) {
          submissionDate = submissions.rows[0].submission_date;
        }

        let status;
        if (!submissionDate) {
          status = "missed";
        } else if (new Date(submissionDate) <= new Date(phase.deadline)) {
          status = "done";
        } else {
          status = "late";
        }

        return {
          proj_id: phase.project_id,
          proj_name: phase.phase_name,
          phase_num: phase.phase_num,
          max_grade: phase.max_grade,
          due_date: phase.deadline,
          type: "phase",
          status: status,
        };
      })
    );

    const resp = { assignments: assignmentres, phases: phasesres };
    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    console.error("Error fetching deadlines:", error);
    return NextResponse.json(
      { error: "Failed to fetch deadlines" },
      { status: 500 }
    );
  }
}
