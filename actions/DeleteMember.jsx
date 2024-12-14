"use server";
import pool from "@/lib/db";

export async function DeleteMember(student_ID, Project_ID, Team_Num) {
    console.log("Received parameters:", { student_ID, Project_ID, Team_Num });

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
        delete from participation where student_ID = $1 and Project_ID = $2 and Team_Num = $3  
        `,
            [student_ID, Project_ID, Team_Num]
        );

        console.log("Database insertion result:", result);

        return {
            status: 200,
            message: "member deleted successfully",
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
