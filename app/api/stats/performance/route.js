"use server";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

// Query functions
async function getTopRatedOverall() {
  const result = await pool.query(
    `
    SELECT 
      u.user_id,
      CONCAT(u.fname, ' ', u.lname) as name,
      ROUND(AVG(r.rating)::numeric, 2) as average_rating,
      COUNT(DISTINCT r.project_id) as projects_reviewed
    FROM users u
    JOIN review r ON u.user_id = r.reviewee_id
    WHERE u.role = 'student'
    GROUP BY u.user_id, name
    HAVING COUNT(DISTINCT r.project_id) > 0
    ORDER BY average_rating DESC
    LIMIT 3;
  `
  );

  // Filter out students with an average rating of zero
  const students = result.rows.filter((student) => student.average_rating > 0);

  return students;
}

async function getAllProjects() {
  const result = await pool.query(`
    SELECT project_id, project_name
    FROM project
    ORDER BY project_id;
  `);
  return result.rows;
}

async function getAllCourses() {
  const result = await pool.query(`
    SELECT course_code, course_name
    FROM course
    ORDER BY course_code;
  `);
  return result.rows;
}

async function getTopStudentForProject(projectId) {
  const result = await pool.query(
    `
    SELECT 
      u.user_id,
      CONCAT(u.fname, ' ', u.lname) as name,
      ROUND(AVG(r.rating)::numeric, 2) as average_rating,
      COUNT(r.rating) as review_count
    FROM users u
    JOIN review r ON u.user_id = r.reviewee_id
    WHERE u.role = 'student'
    AND r.project_id = $1
    GROUP BY u.user_id, u.fname, u.lname
    ORDER BY average_rating DESC
    LIMIT 1;
  `,
    [projectId]
  );

  const student = result.rows[0];
  // Ensure we only return the student if their average rating is greater than zero
  return student && student.average_rating > 0 ? student : null;
}

async function getTopGradesOverall() {
  const result = await pool.query(
    `
    SELECT 
      u.user_id,
      CONCAT(u.fname, ' ', u.lname) as name,
      (
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
        ), 0)
      ) as total_grade,
      COUNT(DISTINCT e.course_code) as courses_count
    FROM users u
    JOIN enrollment e ON u.user_id = e.student_id
    WHERE u.role = 'student'
    GROUP BY u.user_id, u.fname, u.lname, e.course_code
    ORDER BY total_grade DESC
    LIMIT 3;
  `
  );

  // Filter out students with an average total grade of zero
  const students = result.rows.filter((student) => student.total_grade > 0);

  return students;
}

async function getTopStudentForCourse(courseCode) {
  const result = await pool.query(
    `
    SELECT 
      u.user_id,
      CONCAT(u.fname, ' ', u.lname) as name,
      COALESCE((
        SELECT SUM(s1.grade)
        FROM submission s1
        JOIN assignmentsubmission asub ON s1.submission_id = asub.submission_id
        JOIN assignment a ON asub.assignment_id = a.assignment_id
        WHERE s1.student_id = u.user_id 
        AND a.course_code = $1
      ), 0) as assignment_grades,
      COALESCE((
        SELECT SUM(s2.grade)
        FROM submission s2
        JOIN phasesubmission ps ON s2.submission_id = ps.submission_id
        JOIN phase ph ON ps.project_id = ph.project_id AND ps.phase_num = ph.phase_num
        JOIN project p ON ph.project_id = p.project_id
        WHERE s2.student_id = u.user_id 
        AND p.course_code = $1
      ), 0) as phase_grades
    FROM users u
    JOIN enrollment e ON u.user_id = e.student_id
    WHERE u.role = 'student'
    AND e.course_code = $1
    GROUP BY u.user_id, u.fname, u.lname
    ORDER BY (
      COALESCE((
        SELECT SUM(s1.grade)
        FROM submission s1
        JOIN assignmentsubmission asub ON s1.submission_id = asub.submission_id
        JOIN assignment a ON asub.assignment_id = a.assignment_id
        WHERE s1.student_id = u.user_id 
        AND a.course_code = $1
      ), 0) +
      COALESCE((
        SELECT SUM(s2.grade)
        FROM submission s2
        JOIN phasesubmission ps ON s2.submission_id = ps.submission_id
        JOIN phase ph ON ps.project_id = ph.project_id AND ps.phase_num = ph.phase_num
        JOIN project p ON ph.project_id = p.project_id
        WHERE s2.student_id = u.user_id 
        AND p.course_code = $1
      ), 0)
    ) DESC
    LIMIT 1;
  `,
    [courseCode]
  );

  const student = result.rows[0];
  if (student) {
    student.total_grade =
      student.assignment_grades && student.phase_grades
        ? Number(student.assignment_grades) + Number(student.phase_grades)
        : null;

    // Ensure we only return the student if their total grade is greater than zero
    return student.total_grade > 0 ? student : null;
  }
  return null;
}

// Main route handler
export async function GET(request) {
  try {
    // Get all stats in parallel
    const [topRatedOverall, projects, topGradesOverall, courses] =
      await Promise.all([
        getTopRatedOverall(),
        getAllProjects(),
        getTopGradesOverall(),
        getAllCourses(),
      ]);

    // Get top students for each project
    const topRatedByProject = await Promise.all(
      projects.map(async (project) => ({
        project_id: project.project_id,
        project_name: project.project_name,
        top_student: await getTopStudentForProject(project.project_id),
      }))
    );

    // Get top students for each course
    const topGradesByCourse = await Promise.all(
      courses.map(async (course) => ({
        course_code: course.course_code,
        course_name: course.course_name,
        top_student: await getTopStudentForCourse(course.course_code),
      }))
    );

    // Filter out items with no data
    const filteredProjects = topRatedByProject.filter(
      (p) => p.top_student !== null
    );
    const filteredCourses = topGradesByCourse.filter(
      (c) => c.top_student !== null
    );

    const resp = {
      topRatedStudents: {
        overall: topRatedOverall,
        byProject: filteredProjects,
      },
      topPerformingStudents: {
        overall: topGradesOverall,
        byCourse: filteredCourses,
      },
    };

    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    console.error("Error fetching student performance statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch student performance statistics" },
      { status: 500 }
    );
  }
}
