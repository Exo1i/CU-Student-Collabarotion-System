"use server";
import pool from "@/lib/db";

export async function updateAssignment(
  id,
  title,
  maxGrade,
  description,
  due_date
) {
  maxGrade = Number(maxGrade);

  // Validate input more rigorously
  if (!id || id < 0) {
    console.error("Missing required parameters");
    return {
      status: 422,
      message: "Invalid submission ID data",
    };
  }

  try {
    const result = await pool.query(
      `
           UPDATE assignment SET title = $1, max_grade = $2, description = $3, due_date = $4
           WHERE assignment_id = $5;
        `,
      [title, maxGrade, description, due_date, id]
    );

    console.log("Database insertion result:", result);

    return {
      status: 200,
      message: "assignment modified successfully",
    };
  } catch (err) {
    console.error("Detailed error:", {
      message: err.message,
      code: err.code,
      detail: err.detail,
      stack: err.stack,
    });

    return {
      status: 500,
      message: "Database update failed",
      error: err.message,
    };
  }
}
