// Server action in phase-actions.js
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

    return {
      status: 200,
      message: "Phase added successfully",
    };
  } catch (err) {
    console.error("Detailed error:", err);
    if (err.code === "23505") {
      return {
        status: 409,
        message: "Phase already exists",
      };
    }
    return {
      status: 500,
      message: "Database insertion failed",
      error: err.message,
    };
  }
}

export async function deletePhase(phase_num, project_id) {
  if (!phase_num || !project_id) {
    return {
      status: 422,
      message: "Invalid Phase data",
    };
  }

  try {
    const result = await pool.query(
        `
          DELETE
          FROM phase
          WHERE phase_num = $1
            AND project_id = $2
        `,
        [phase_num, project_id]
    );

    return {
      status: 200,
      message: "Phase deleted successfully",
    };
  } catch (err) {
    console.error("Detailed error:", err);
    return {
      status: 500,
      message: "Failed to delete phase",
      error: err.message,
    };
  }
}

export async function editPhase(phase_num, phase_name, description, phase_load, deadline, project_id) {
  if (!phase_num || !project_id) {
    return {
      status: 422,
      message: "Invalid Phase data",
    };
  }

  try {
    const result = await pool.query(
        `
          UPDATE phase
          SET phase_name  = $1,
              description = $2,
              phase_load  = $3,
              deadline    = $4
          WHERE phase_num = $5
            AND project_id = $6
          RETURNING *
        `,
        [phase_name, description, phase_load, deadline, phase_num, project_id]
    );

    if (result.rowCount === 0) {
      return {
        status: 404,
        message: "Phase not found",
      };
    }

    return {
      status: 200,
      message: "Phase updated successfully",
      data: result.rows[0],
    };
  } catch (err) {
    console.error("Detailed error:", err);
    return {
      status: 500,
      message: "Failed to update phase",
      error: err.message,
    };
  }
}

export async function updateSubmissionGrade(submission_id, grade) {
  if (!submission_id) {
    return {
      status: 422,
      message: "Invalid submission data",
    };
  }

  try {
    const result = await pool.query(
        `
          UPDATE submission
          SET grade = $1
          WHERE submission_id = $2
          RETURNING *
        `,
        [grade, submission_id]
    );

    if (result.rowCount === 0) {
      return {
        status: 404,
        message: "Submission not found",
      };
    }

    return {
      status: 200,
      message: "Grade updated successfully",
      data: result.rows[0],
    };
  } catch (err) {
    console.error("Detailed error:", err);
    return {
      status: 500,
      message: "Failed to update grade",
      error: err.message,
    };
  }
}