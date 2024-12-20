import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const par = await params;
    const { searchParams } = new URL(request.url);
    const stud_id = searchParams.get("stud");

    const projectDetails = await pool.query(
      ` SELECT Project_ID, Project_Name, Max_team_size, description, start_date, end_date
        FROM Project WHERE Project_ID = $1;
       `,
      [par.projectid]
    );
    const phases = await pool.query(
      `select phase_num, phase_name, phase_load, deadline
       from phase
       where project_id = $1`,
      [par.projectid]
    );
    const phasesres = await Promise.all(
      phases.rows.map(async (phase) => {
        const phasess = await pool.query(
          `
        SELECT PhaseSubmission.submission_id, COUNT(PhaseSubmission.submission_id)
        FROM Submission
        JOIN PhaseSubmission ON Submission.submission_id = PhaseSubmission.submission_id
        WHERE phase_num = $1 AND student_id = $2
        GROUP BY PhaseSubmission.submission_id
       `,
          [phase.phase_num, stud_id]
        );

        const status = phasess.rowCount > 0 ? "submitted" : "not_submitted";
        const id = phasess.rowCount > 0 ? phasess.rows[0].submission_id : null;
        //console.log(submissions.rows[0].count);
        return { ...phase, status: status, submissionID: id };
      })
    );

    const resp = {
      ...projectDetails.rows[0],
      phases: phasesres,
    };

    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    console.error("Error fetching phases:", error);
    return NextResponse.json(
      { error: "Failed to fetch phases" },
      { status: 500 }
    );
  }
}
