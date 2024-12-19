import pool from "@/lib/db";
import {NextResponse} from "next/server";

//get a phase given projectid and phase number
export async function GET(request, { params }) {
  try {
    const par = await params;
    const resp = await pool.query(
      "SELECT * FROM phase WHERE Project_ID = $1 AND Phase_Num = $2",
      [par.projectid, par.phaseid]
    );
    if (resp.rows.length === 0) {
      return NextResponse.json({ error: "phase not found" }, { status: 404 });
    }
    return NextResponse.json(resp.rows[0], { status: 200 });
  } catch (err) {
    console.error("Error fetching phase:", err);
    return NextResponse.json(
      { error: "Failed to fetch phase" },
      { status: 500 }
    );
  }
}

// edit load and date of a phase given the project id and the phase number
export async function PUT(request, { params }) {
  try {
    const par = await params;
    const { load, deadline } = await request.json();
    await pool.query(
      "UPDATE phase SET Phase_Load = $1, deadline = $2 WHERE Project_ID = $3 AND Phase_Num = $4",
      [load, deadline, par.projectid, par.phaseid]
    );
    return NextResponse.json({ message: "phase updated" }, { status: 200 });
  } catch (err) {
    console.error("Error updating phase:", err);
    return NextResponse.json(
      { error: "Failed to update phase" },
      { status: 500 }
    );
  }
}

//delete a specific phase given its number and project id
export async function DELETE(request, { params }) {
  try {
    const par = await params;
    await pool.query(
      "DELETE FROM phase WHERE Project_ID = $1 AND Phase_Num = $2",
      [par.projectid, par.phaseid]
    );
    return NextResponse.json({ message: "phase deleted" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting phase: ", err);
    return NextResponse.json(
      { error: "Failed to delete phase" },
      { status: 500 }
    );
  }
}
