"use server";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

// Detailed stats for top-performing students
export async function GET(request) {
  try {
    // Get top 2 students with the highest average ratings across all reviews
    const ProjPerformer = await pool.query(
      ` SELECT concat(u.fname , ' ' , u.lname) as full_name, u.img_url, AVG(r.rating) AS average_rating
        FROM review as r, users as u
        where r.reviewee_id = u.user_id
        GROUP BY r.reviewee_id, full_name, img_url
        ORDER BY average_rating DESC
        LIMIT 2;`
    );

    // Get the student with the highest average rating in each project
    const RatedPerProjRes = await pool.query(
      `SELECT r.project_id, p.project_name, concat(u.fname , ' ' , u.lname) as full_name, u.img_url, AVG(r.rating) AS average_rating
       FROM review r, project p, users u
       where r.project_id = p.project_id and u.user_id = r.reviewee_id
       GROUP BY r.project_id, p.project_name, full_name, img_url
       ORDER BY r.project_id, average_rating DESC;`
    );

    // Process the highest-rated student for each project
    const RatedPerProj = {};
    RatedPerProjRes.rows.forEach((row) => {
      if (!RatedPerProj[row.project_id]) {
        RatedPerProj[row.project_id] = row;
      }
    });

    // // Get top 2 students with the highest grades across all courses
    // const topGradesStudentsResult = await pool.query(
    //   `SELECT g.student_id, AVG(g.grade) AS average_grade
    //    FROM grades g
    //    GROUP BY g.student_id
    //    ORDER BY average_grade DESC
    //    LIMIT 2;`
    // );

    // // Get the student with the highest grades for each course
    // const highestGradesPerCourseResult = await pool.query(
    //   `SELECT g.course_code, g.student_id, AVG(g.grade) AS average_grade
    //    FROM grades g
    //    GROUP BY g.course_code, g.student_id
    //    ORDER BY g.course_code, average_grade DESC;`
    // );

    // // Process the highest-graded student for each course
    // const highestGradesPerCourse = {};
    // highestGradesPerCourseResult.rows.forEach((row) => {
    //   if (!highestGradesPerCourse[row.course_code]) {
    //     highestGradesPerCourse[row.course_code] = row;
    //   }
    // });

    const resp = {
      topRatedStudents: ProjPerformer.rows,
      HighestRatedPerProj: Object.values(RatedPerProj),
      //   topGradesStudents: topGradesStudentsResult.rows,
      //   highestGradesPerCourse: Object.values(highestGradesPerCourse),
    };

    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    console.error("Error fetching student statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch student statistics" },
      { status: 500 }
    );
  }
}
