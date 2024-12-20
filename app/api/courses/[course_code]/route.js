import pool from "@/lib/db";
import { NextResponse } from "next/server";

// Get a course and its projects given course code
export async function GET(request, { params }) {
  try {
    const par = await params;
    const courseinfo = await pool.query(
      `SELECT course_code, course_name, course_img, COALESCE(description, '') AS course_description, max_grade, instructor_id, CONCAT(fname,' ',lname) AS full_name, img_url
       FROM course, users
       WHERE instructor_id = user_id AND course_code = $1`,
      [par.course_code]
    );

    if (courseinfo.rowCount === 0) {
      return NextResponse.json("Course not found", { status: 404 });
    }

    const courseproject = await pool.query(
      `SELECT project_id, project_name, start_date, end_date, description, max_team_size, max_grade
       FROM project
       WHERE course_code = $1`,
      [par.course_code]
    );

    const project = courseproject.rowCount === 0 ? {} : courseproject.rows[0];
    const category =
      courseproject.rowCount === 0 ? "theory_only" : "project_based";

    const courseassignments = await pool.query(
      `SELECT assignment_id, title, description, max_grade, due_date
       FROM assignment
       WHERE course_code = $1`,
      [par.course_code]
    );

    const resp = {
      ...courseinfo.rows[0],
      project: project,
      assignments: courseassignments.rows,
      category: category,
    };

    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

//to be made into a server component
// //delete a course given course code
// export async function DELETE(request, { params }) {
//   try {
//     const par = await params;
//     const resp = await pool.query("DELETE FROM Course WHERE Course_Code = $1", [
//       par.course_code,
//     ]);
//     return NextResponse.json("Course deleted successfully", { status: 200 });
//   } catch (error) {
//     console.error("Error deleting course: ", error);
//     return NextResponse.json(
//       { error: "Failed to delete course" },
//       { status: 500 }
//     );
//   }
// }

// //update a row in the courses table
// export async function PUT(request, { params }) {
//   try {
//     const par = await params;
//     const { name, instructor, grade } = await request.json();

//     const instructorCheck = await pool.query(
//       "SELECT Role FROM Users WHERE User_ID = $1 AND Role = 'instructor'",
//       [instructor]
//     );
//     if (instructorCheck.rows.length === 0) {
//       return NextResponse.json(
//         { error: "Instructor_ID must have the role of instructor" },
//         { status: 400 }
//       );
//     }

//     await pool.query(
//       "UPDATE Course SET Course_Name = $1, Instructor_ID = $2, max_Grade = $3 WHERE Course_Code = $4",
//       [name, instructor, grade, par.course_code]
//     );
//     return NextResponse.json({ message: "course updated" }, { status: 200 });
//   } catch (error) {
//     console.error("Error updating course:", error);
//     return NextResponse.json(
//       { error: "Failed to update course" },
//       { status: 500 }
//     );
//   }
// }
