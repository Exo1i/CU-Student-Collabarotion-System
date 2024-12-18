"use server";
import pool from "@/lib/db";

export async function DeleteTechnology(projectid, teamNum, technology) {
    console.log("Received parameters:", { projectid, teamNum, technology });

    // Validate input more rigorously
    if (!projectid || !teamNum || !technology) {
        console.error("Missing required parameters");
        return {
            status: 422,
            message: "Invalid technology data",
        };
    }

    try {
        const result = await pool.query(
            `
        delete from technology where Project_ID = $1 and  Team_Num = $2 and technology = $3   
        `,
            [projectid, teamNum, technology]
        );

        console.log("Database insertion result:", result);

        return {
            status: 200,
            message: "technology add successfully",
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
