"use server";
import pool from "@/lib/db";

export async function deleteAssignment(id, courseCode) {
  // Validate input more rigorously
  if (!id || courseCode === "") {
    console.error("Missing required parameters");
    return {
      status: 422,
      message: "Invalid assignment data",
    };
  }

  try {
    const result = await pool.query(
      `
            DELETE FROM assignment where assignment_id = $1 and course_code = $2;
        `,
      [id, courseCode]
    );

    console.log("Database deletion result:", result);

    return {
      status: 200,
      message: "assignment deleted successfully",
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
      message: "Database deletion failed",
      error: err.message,
    };
  }
}
