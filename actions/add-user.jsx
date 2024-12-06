"use server";
import pool from "@/lib/db";

export async function addUser(userId, fname, lname, role) {
  console.log("Received parameters:", { userId, fname, lname, role });

  // Validate input more rigorously
  if (!userId || !fname || !lname || !role) {
    console.error("Missing required parameters");
    return {
      status: 422,
      message: "Invalid user data",
    };
  }

  try {
    const result = await pool.query(
      `
            INSERT INTO users (user_id, fname, lname, role) 
            VALUES ($1, $2, $3, $4)
        `,
      [userId, fname, lname, role]
    );

    console.log("Database insertion result:", result);

    return {
      status: 200,
      message: "User added successfully",
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
        message: "User already exists",
      };
    }

    return {
      status: 500,
      message: "Database insertion failed",
      error: err.message,
    };
  }
}
