"use server";
import pool from "@/lib/db";

export async function AddPhaseSubmission(Submission_ID, Project_ID, Phase_Num) {
    console.log("Received parameters:", {Submission_ID , Project_ID , Phase_Num});

    // Validate input more rigorously
    if (!Submission_ID || !Project_ID || !Phase_Num) {
        console.error("Missing required parameters");
        return {
            status: 422,
            message: "Invalid Team data",
        };
    }

    try {
        const result = await pool.query(
            `
        INSERT INTO phaseSubmission (Submission_ID, Project_ID, Phase_Num)  
            VALUES ($1, $2, $3)
        `,
            [Submission_ID , Project_ID , Phase_Num]
        );

        console.log("Database insertion result:", result);

        return {
            status: 200,
            message: "phase submited successfully",
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
                message: "phase submission already exists",
            };
        }

        return {
            status: 500,
            message: "Database insertion failed",
            error: err.message,
        };
    }
}
