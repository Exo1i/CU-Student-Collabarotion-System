"use server";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

// General stats (count and percentages of different types of users and courses)
export async function GET(request) {
  try {
    // Get total number of users
    const totUsersRes = await pool.query(
      `SELECT COUNT(*) AS total_users FROM Users;`
    );
    const totUsers = totUsersRes.rows[0].total_users;

    // Get count of students
    const studRes = await pool.query(
      `SELECT COUNT(*) AS total_students FROM Users WHERE role = 'student';`
    );
    const totStud = studRes.rows[0].total_students;

    // Get count of instructors
    const instRes = await pool.query(
      `SELECT COUNT(*) AS total_instructors FROM Users WHERE role = 'instructor';`
    );
    const totInst = instRes.rows[0].total_instructors;

    // Get count of admins
    const adminsRes = await pool.query(
      `SELECT COUNT(*) AS total_admins FROM Users WHERE role = 'admin';`
    );
    const totAdmins = adminsRes.rows[0].total_admins;

    // Calculate percentages
    const studPer = ((totStud / totUsers) * 100).toFixed(2);
    const instPer = ((totInst / totUsers) * 100).toFixed(2);
    const adminPer = ((totAdmins / totUsers) * 100).toFixed(2);

    const users_resp = {
      totalUsers: totUsers,
      totalStudents: totStud,
      studentPercentage: studPer,
      totalInstructors: totInst,
      instructorPercentage: instPer,
      totalAdmins: totAdmins,
      adminPercentage: adminPer,
    };

    // Get total number of courses
    const totCoursesRes = await pool.query(
      `SELECT COUNT(*) AS total_courses FROM Course;`
    );
    const totCourses = totCoursesRes.rows[0].total_courses;

    // Get count of project-based courses
    const projBasedRes = await pool.query(
      `SELECT COUNT(DISTINCT c.course_code) AS project_based_courses
       FROM Course c
       JOIN Project p ON c.course_code = p.course_code;`
    );
    const projBased = projBasedRes.rows[0].project_based_courses;

    // Get count of theory-only courses
    const theoryOnlyRes = await pool.query(
      `SELECT COUNT(*) AS theory_only_courses
       FROM Course c
       WHERE NOT EXISTS (
         SELECT 
         FROM Project p
         WHERE c.course_code = p.course_code
       );`
    );
    const theoryOnly = theoryOnlyRes.rows[0].theory_only_courses;

    // Calculate percentages for courses
    const projBasedPer = ((projBased / totCourses) * 100).toFixed(2);
    const theoryOnlyPer = ((theoryOnly / totCourses) * 100).toFixed(2);

    const courses_resp = {
      totalCourses: totCourses,
      projectBasedCourses: projBased,
      projectBasedCoursePercentage: projBasedPer,
      theoryOnlyCourses: theoryOnly,
      theoryOnlyCoursePercentage: theoryOnlyPer,
    };

    // Combine the responses
    const resp = {
      users: users_resp,
      courses: courses_resp,
    };

    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
