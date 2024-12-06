import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const par = await params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    //get assignments deadlines
    const assignments = await pool.query(
      `
        SELECT assignment_id, title, due_date, 'assignment' AS type
        FROM Assignment
        WHERE due_date = $1;
    `,
      [date]
    );

    const assignmentres = await Promise.all(
      assignments.rows.map(async (assignment) => {
        const submissions = await pool.query(
          `
           SELECT submission_date
           FROM Submission JOIN AssignmentSubmission ON Submission.Submission_id = AssignmentSubmission.Submission_id
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
          assign_id: assignment.id,
          name: assignment.name,
          due_date: assignment.due_date,
          type: "assignment",
          status: status,
        };
      })
    );

    //get phases deadlines
    const phases = await pool.query(
      `
        SELECT phase.project_id, phase_num, phase_name, deadline, 'phase' AS type
        FROM Phase join project on project.project_id = phase.project_id
        WHERE deadline = $1;
   `,
      [date]
    );

    const phasesres = await Promise.all(
      phases.rows.map(async (phase) => {
        const submissions = await pool.query(
          `
            SELECT submission_date
            FROM submission JOIN phasesubmission ON submission.submission_id = phasesubmission.submission_id
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
        } else if (new Date(submissionDate) <= new Date(phase.end_date)) {
          status = "done";
        } else {
          status = "late";
        }

        return {
          proj_id: phase.project_id,
          proj_name: phase.proj_name,
          phase_num: phase.phase_num,
          due_date: phase.end_date,
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
