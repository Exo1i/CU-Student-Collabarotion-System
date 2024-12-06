"use server";
import pool from "@/lib/db";
export async function addProject(
  projID,
  projName,
  projStartDate,
  projEndDate,
  projDescript,
  projTeamSize,
  projMaxGrade
) {
  console.log("Received parameters:", {
    projID,
    projName,
    projCourse,
    projStartDate,
    projEndDate,
    projDescript,
    projTeamSize,
    projMaxGrade,
  });

  // Validate input more rigorously
  if (
    !projID ||
    !projName ||
    !projCourse ||
    !projStartDate ||
    !projEndDate ||
    !projDescript ||
    !projTeamSize ||
    !projMaxGrade
  ) {
    console.error("Missing required parameters");
    return {
      status: 422,
      message: "Invalid project data",
    };
  }
  try {
    const result = await pool.query(
      `
        INSERT INTO project 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [
        projID,
        projName,
        projStartDate,
        projEndDate,
        projDescript,
        projTeamSize,
        projMaxGrade,
      ]
    );

    console.log("Database insertion result:", result);

    return {
      status: 200,
      message: "Project added successfully",
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
        message: "Project already exists",
      };
    }

    return {
      status: 500,
      message: "Database insertion failed",
      error: err.message,
    };
  }
}
