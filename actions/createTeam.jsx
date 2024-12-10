"use server";
import pool from "@/lib/db";

export async function createTeam( student_ID , projectID, TeamNum, TeamName) {
    console.log("Received parameters:", { student_ID , projectID, TeamNum, TeamName });

    // Validate input more rigorously
    if (!projectID || !TeamNum || !TeamName) {
        console.error("Missing required parameters");
        return {
            status: 422,
            message: "Invalid Team data",
        };
    }

    try {
        const result = await pool.query(
            `
        INSERT INTO Team (Project_ID, Team_Num, Team_Name)  
            VALUES ($1, $2, $3)
        `,
            [projectID , TeamNum , TeamName]
        );

        console.log("Database insertion result:", result);
        await pool.query(
            `
        INSERT INTO participation (student_ID, Project_ID, Team_Num, Leader)  
            VALUES ($1, $2, $3 , $4)
        `,
            [student_ID, projectID, TeamNum, true]
        );
        return {
            status: 200,
            message: "Team created successfully",
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
                message: "Team already exists",
            };
        }

        return {
            status: 500,
            message: "Database insertion failed",
            error: err.message,
        };
    }
}
