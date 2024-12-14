"use server";
import pool from "@/lib/db";

export async function DeleteStudentBadge(userid, badgeid) {
    console.log("Received parameters:", { userid, badgeid });

    // Validate input more rigorously
    if (!userid || !badgeid) {
        console.error("Missing required parameters");
        return {
            status: 422,
            message: "Invalid delete badge data",
        };
    }

    try {
        const result = await pool.query(
            `
        delete from earnedBadges where student_ID = $1 and  Badge_ID = $2 
        `,
            [userid, badgeid]
        );

        console.log("Database deletion result:", result);

        return {
            status: 200,
            message: "badge deleted successfully",
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
            message: "Database deletion failed",
            error: err.message,
        };
    }
}
