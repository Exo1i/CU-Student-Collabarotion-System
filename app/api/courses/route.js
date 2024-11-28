"use server";
import pool from "../../../lib/db";
import { NextResponse } from "next/server";

//get all courses
export async function GET(request) {
  const resp = await pool.query("SELECT * FROM Course");
  return NextResponse.json(resp.rows, { status: 200 });
}

//create a new course
export async function POST(request) {
  try {
    const bodyText = await request.text();
    const body = JSON.parse(bodyText);
    const { course_code, course_name, instructor_ID, max_Grade } = body;
    if (!course_code) {
      return NextResponse.json(
        { error: "Course code is required" },
        { status: 400 }
      );
    }
    const query =
      "INSERT INTO Course (Course_Code, Course_Name, Instructor_ID, max_Grade) VALUES ($1, $2, $3, $4)";
    const values = [course_code, course_name, instructor_ID, max_Grade];
    await pool.query(query, values);
    return NextResponse.json({ message: "Course created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      {
        status: 500,
      }
    );
  }
}
