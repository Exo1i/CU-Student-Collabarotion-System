"use server";
import pool from "@/lib/db";

export async function EarnBadge(userid , badgeid) {
    console.log("Received parameters:", {userid, badgeid});

    // Validate input more rigorously
    if (!userid || !badgeid) {
        console.error("Missing required parameters");
        return {
            status: 422,
            message: "Invalid earn badge data",
        };
    }

    try {
        const result = await pool.query(
            `
        INSERT INTO earnedBadges (student_ID, Badge_ID)  
            VALUES ($1, $2)
        `,
            [userid , badgeid]
        );

        console.log("Database insertion result:", result);

        return {
            status: 201,
            message: "badge earned successfully",
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
                message: "badge already earned",
            };
        }

        return {
            status: 500,
            message: "Database insertion failed",
            error: err.message,
        };
    }
}
