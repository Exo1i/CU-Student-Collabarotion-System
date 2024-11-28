import pool from "../../../../lib/db";
import { NextResponse } from "next/server";

//get a course given course code
export async function GET(request, { params }) {
  try {
    const resp = await pool.query(
      "SELECT * FROM Course WHERE Course_Code = $1",
      [params.course_code]
    );
    if (resp.rowCount === 0)
      return NextResponse.json("Course not found", { status: 404 });
    return NextResponse.json(resp.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

//delete a course given course code
export async function DELETE(request, { params }) {
  try {
    const resp = await pool.query("DELETE FROM Course WHERE Course_Code = $1", [
      params.course_code,
    ]);
    return resp.json("Course deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting course: ", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}

//update a row in the courses table
export async function PUT(request, { params }) {
  try {
    const { name, instructor, grade } = await request.json();
    await pool.query(
      "UPDATE Course SET Course_Name = $1, Instructor_ID = $2, max_Grade = $3 WHERE Course_Code = $4",
      [name, instructor, grade, params.course_code]
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
