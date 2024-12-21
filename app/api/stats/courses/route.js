"use server";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

// Query functions
async function getCourseStatistics() {
  const result = await pool.query(`
    SELECT 
      student_grades.course_code,
      c.course_name,
      AVG(total_grade) as average_grade,
      MIN(total_grade) as min_grade,
      MAX(total_grade) as max_grade
    FROM (
      SELECT 
        e.course_code,
        u.user_id,
        COALESCE((
          SELECT SUM(s1.grade)
          FROM submission s1
          JOIN assignmentsubmission asub ON s1.submission_id = asub.submission_id
          JOIN assignment a ON asub.assignment_id = a.assignment_id
          WHERE s1.student_id = u.user_id 
          AND a.course_code = e.course_code
        ), 0) +
        COALESCE((
          SELECT SUM(s2.grade)
          FROM submission s2
          JOIN phasesubmission ps ON s2.submission_id = ps.submission_id
          JOIN phase ph ON ps.project_id = ph.project_id AND ps.phase_num = ph.phase_num
          JOIN project p ON ph.project_id = p.project_id
          WHERE s2.student_id = u.user_id 
          AND p.course_code = e.course_code
        ), 0) as total_grade
      FROM users u
      JOIN enrollment e ON u.user_id = e.student_id
      WHERE u.role = 'student'
    ) as student_grades
    JOIN course c ON student_grades.course_code = c.course_code
    GROUP BY student_grades.course_code, c.course_name
    ORDER BY student_grades.course_code;
  `);

  return result.rows;
}

// Main route handler
export async function GET(request) {
  try {
    // Get course statistics
    const courseStatistics = await getCourseStatistics();

    const resp = {
      courseStatistics: courseStatistics,
    };

    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    console.error("Error fetching course statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch course statistics" },
      { status: 500 }
    );
  }
}
