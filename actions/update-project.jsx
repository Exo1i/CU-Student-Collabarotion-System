"use server";
import pool from "@/lib/db";

export async function updateProject(
  id,
  title,
  maxGrade,
  description,
  due_date,
  maxteamsize
) {
  maxGrade = Number(maxGrade);
  maxteamsize = Number(maxteamsize);

  // Validate input more rigorously
  if (!id || id < 0 || title === "") {
    console.error("Missing required parameters");
    return {
      status: 422,
      message: "Invalid project ID data",
    };
  }

  try {
    const result = await pool.query(
      `
           UPDATE project SET project_name = $1, max_grade = $2, description = $3, end_date = $4, max_team_size = $5
           WHERE project_id = $6;
        `,
      [title, maxGrade, description, due_date, maxteamsize, id]
    );

    console.log("Database insertion result:", result);

    return {
      status: 200,
      message: "project modified successfully",
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
