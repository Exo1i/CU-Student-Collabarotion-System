"use server";
import pool from "@/lib/db";

export async function Participation(student_ID, Project_ID, Team_Num, Leader) {
    console.log("Received parameters:", { student_ID, Project_ID, Team_Num, Leader });

    // Validate input more rigorously
    if (!student_ID || !Project_ID || !Team_Num) {
        console.error("Missing required parameters");
        return {
            status: 422,
            message: "Invalid Participation data",
        };
    }

    try {
        const result = await pool.query(
            `
        INSERT INTO participation (student_ID, Project_ID, Team_Num, Leader)  
            VALUES ($1, $2, $3 , $4)
        `,
            [student_ID, Project_ID, Team_Num, Leader]
        );

        console.log("Database insertion result:", result);

        return {
            status: 200,
            message: "joined Team successfully",
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
                message: "Participation already exists",
            };
        }

        return {
            status: 500,
            message: "Database insertion failed",
            error: err.message,
        };
    }
}
