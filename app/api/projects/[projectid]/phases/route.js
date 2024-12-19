import pool from "@/lib/db";
import {NextResponse} from "next/server";

export async function GET(request, { params }) {
  try {
    const par = await params;
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

    const resp = {
      ...projectDetails.rows[0],
      phases: phases.rows,
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
