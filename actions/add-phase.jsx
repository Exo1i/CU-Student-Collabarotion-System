"use server";
import pool from "@/lib/db";

export async function addPhase(
  phase_num,
  phase_name,
  description,
  phase_load,
  dueDate,
  project_id
) {
  // Validate input more rigorously
  if (!phase_num || !project_id) {
    console.error("Missing required parameters");
    return {
      status: 422,
      message: "Invalid Phase data",
    };
  }

  try {
    const result = await pool.query(
      `
            INSERT INTO phase (project_id, phase_num, phase_name, description, phase_load, deadline) 
            VALUES ($1, $2, $3, $4, $5, $6)
        `,
      [project_id, phase_num, phase_name, description, phase_load, dueDate]
    );

    console.log("Database insertion result:", result);

    return {
      status: 200,
      message: "phase added successfully",
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
        message: "phase already exists",
      };
    }

    return {
      status: 500,
      message: "Database insertion failed",
      error: err.message,
    };
  }
}
