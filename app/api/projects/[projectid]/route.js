import pool from "@/lib/db";
import { NextResponse } from "next/server";

//get a Project and all its phases and teams given its id
export async function GET(request, { params }) {
  try {
    const par = await params;
    const projectinfo = await pool.query(
      "SELECT * FROM Project WHERE Project_ID = $1",
      [par.projectid]
    );
    if (projectinfo.rowCount === 0)
      return NextResponse.json("Project not found", { status: 404 });

    const projectphases = await pool.query(
      "SELECT * FROM Phase WHERE Project_ID = $1",
      [par.projectid]
    );

    const projectteams = await pool.query(
      "SELECT * FROM Team WHERE Project_ID = $1",
      [par.projectid]
    );

    const resp = {
      ...projectinfo.rows[0],
      phases: projectphases.rows,
      teams: projectteams.rows,
    };
    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    console.error("Error fetching Project:", error);
    return NextResponse.json(
      { error: "Failed to fetch Project" },
      { status: 500 }
    );
  }
}

//delete a Project given its id
export async function DELETE(request, { params }) {
  try {
    const par = await params;
    const resp = await pool.query("DELETE FROM Project WHERE Project_ID= $1", [
      par.projectid,
    ]);
    return NextResponse.json("Project deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting Project: ", error);
    return NextResponse.json(
      { error: "Failed to delete Project" },
      { status: 500 }
    );
  }
}

//update a enddate and maximum team size in a project
export async function PUT(request, { params }) {
  try {
    const par = await params;
    const { endDate, maxSize } = await request.json();

    await pool.query(
      "UPDATE Project SET End_Date = $1, Max_Team_Size = $2 WHERE Project_ID = $3",
      [endDate, maxSize, par.projectid]
    );
    return NextResponse.json({ message: "course updated" }, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

//add a new phase in a project
export async function POST(request, { params }) {
  try {
    const par = await params;
    const { number, name, load, deadline } = await request.json();

    await pool.query(
      "INSERT INTO phase (Project_ID, Phase_Num, Phase_Name, Phase_load, deadline) VALUES ($1, $2, $3, $4, $5)",
      [par.projectid, number, name, load, deadline]
    );
    return NextResponse.json({ message: "Phase created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create Phase" },
      { status: 500 }
    );
  }
}
