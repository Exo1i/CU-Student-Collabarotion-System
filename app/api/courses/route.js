"use server";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

// Get all courses
export async function GET(request) {
  try {
    const coursesResult = await pool.query(
      `SELECT course_code, course_name, course_img, instructor_id, CONCAT(fname,' ',lname) AS full_name, img_url
       FROM course
       JOIN users ON instructor_id = user_id;`
    );

    if (coursesResult.rowCount === 0) {
      return NextResponse.json("No courses found", { status: 404 });
    }

    const coursesWithCategory = await Promise.all(
      coursesResult.rows.map(async (course) => {
        const projectResult = await pool.query(
          `SELECT project_id
           FROM project
           WHERE course_code = $1;`,
          [course.course_code]
        );

        const category =
          projectResult.rowCount === 0 ? "theory_only" : "project_based";

        return {
          ...course,
          category: category,
        };
      })
    );

    return NextResponse.json(coursesWithCategory, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
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
