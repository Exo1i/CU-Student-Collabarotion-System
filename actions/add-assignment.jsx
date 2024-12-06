"use server";
import pool from "@/lib/db";

export async function addAssignment(
  title,
  maxGrade,
  description,
  dueDate,
  courseCode
) {
  console.log("Received parameters:", {
    title,
    maxGrade,
    description,
    dueDate,
    courseCode,
  });

  // Validate input more rigorously
  if (!title || !maxGrade) {
    console.error("Missing required parameters");
    return {
      status: 422,
      message: "Invalid assignment data",
    };
  }

  try {
    const result = await pool.query(
      `
            INSERT INTO assignment (title, max_grade, description, due_date, course_code) 
            VALUES ($1, $2, $3, $4, $5)
        `,
      [title, maxGrade, description, dueDate, courseCode]
    );

    console.log("Database insertion result:", result);

    return {
      status: 200,
      message: "assignment added successfully",
    };
  } catch (err) {
    console.error("Detailed error:", {
      message: err.message,
      code: err.code,
      detail: err.detail,
      stack: err.stack,
    });

    if (err.code === "23505") {
      // Unique constraint violation
      return {
        status: 409, // Conflict
        message: "assignment already exists",
      };
    }

    return {
      status: 500,
      message: "Database insertion failed",
      error: err.message,
    };
  }
}
