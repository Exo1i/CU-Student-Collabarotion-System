import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const par = await params;
    const phases = await pool.query(
      `select phase_num, phase_name, phase_load, deadline
       from phase
       where project_id = $1`,
      [par.projectid]
    );
    if (phases.rowCount === 0) return NextResponse.json("no phases found ");
    return NextResponse.json(phases.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching phases:", error);
    return NextResponse.json(
      { error: "Failed to fetch phases" },
      { status: 500 }
    );
  }
}
