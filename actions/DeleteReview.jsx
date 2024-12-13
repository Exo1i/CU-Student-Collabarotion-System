"use server";
import pool from "@/lib/db";

export async function DeleteReview(reviewer_ID, reviewee_ID, Project_ID) {
    console.log("Received parameters:", {reviewer_ID, reviewee_ID , Project_ID});

    // Validate input more rigorously
    if (!reviewer_ID || !reviewee_ID || !Project_ID) {
        console.error("Missing required parameters");
        return {
            status: 422,
            message: "Invalid review data",
        };
    }

    try {
        const result = await pool.query(
            `
        delete from review where reviewer_ID = $1 and reviewee_ID = $2 and Project_ID = $3  
        `,
            [reviewer_ID, reviewee_ID ,  Project_ID]
        );

        console.log("Database deletion result:", result);

        return {
            status: 200,
            message: "review deleted successfully",
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
