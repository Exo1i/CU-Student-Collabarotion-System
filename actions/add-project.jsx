"use server";
import pool from "@/lib/db";

export default async function addProject(
  name,
  coursecode,
  endDate,
  description,
  maxSize,
  maxgrade
) {
  console.log("Received parameters:", {
    name,
    coursecode,
    endDate,
    description,
    maxSize,
    maxgrade,
  });

  // Validate input more rigorously
  if (!name) {
    console.error("Missing required parameters");
    return {
      status: 422,
      message: "Invalid project data",
    };
  }

  try {
    const result = await pool.query(
      `
            INSERT INTO Project (Project_Name, Course_Code, End_Date, Description, Max_team_size, max_grade) VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, coursecode, endDate, description, maxSize, maxgrade]
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

    if (err.code === "23000") {
      // Refrential integrity violation
      return {
        message: "Course does not exists",
      };
    }

    return {
      status: 500,
      message: "Database insertion failed",
      error: err.message,
    };
  }
}
