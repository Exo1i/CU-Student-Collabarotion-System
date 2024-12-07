"use server";
import pool from "../../../lib/db";
import { NextResponse } from "next/server";

//get all courses
export async function GET(request) {
  const resp = await pool.query(
    `select course_code, course_name, course_img, instructor_id, fname, lname, img_url
     from course join users on instructor_id = user_id;
    `
  );
  if (resp.rowCount === 0)
    return NextResponse.json("no courses found", { status: 404 });

  return NextResponse.json(resp.rows, { status: 200 });
}

//to be made into a server component to
// //create a new course
// export async function POST(request) {
//   try {
//     const bodyText = await request.text();
//     const body = JSON.parse(bodyText);
//     const { course_code, course_name, instructor_ID, max_Grade } = body;

//     if (!course_code) {
//       return NextResponse.json(
//         { error: "Course code is required" },
//         { status: 400 }
//       );
//     }

//     const instructorCheck = await pool.query(
//       "SELECT Role FROM Users WHERE User_ID = $1 AND Role = 'instructor'",
//       [instructor_ID]
//     );
//     if (instructorCheck.rows.length === 0) {
//       return NextResponse.json(
//         { error: "Instructor_ID must have the role of instructor" },
//         { status: 400 }
//       );
//     }
//     const query =
//       "INSERT INTO Course (Course_Code, Course_Name, Instructor_ID, max_Grade) VALUES ($1, $2, $3, $4)";
//     const values = [course_code, course_name, instructor_ID, max_Grade];
//     await pool.query(query, values);
//     return NextResponse.json({ message: "Course created" }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to create course" },
//       {
//         status: 500,
//       }
//     );
//   }
// }
