"use server";
import pool from "@/lib/db";

export async function addAssignmentGrade(subID, submittedGrade) {
  submittedGrade = Number(submittedGrade);
  console.log("Received parameters:", { subID });

  // Validate input more rigorously
  if (!subID) {
    console.error("Missing required parameters");
    return {
      status: 422,
      message: "Invalid submission ID data",
    };
  }

  try {
    const result = await pool.query(
      `
           UPDATE submission SET grade = $1
           WHERE submission_id = $2;
        `,
      [submittedGrade, subID]
    );

    console.log("Database insertion result:", result);

    return {
      status: 200,
      message: "grade updated successfully",
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
      message: "Database insertion failed",
      error: err.message,
    };
  }
}
