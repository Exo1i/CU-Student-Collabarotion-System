"use server";
import pool from "@/lib/db";

export async function AddTechnology(projectid , teamNum , technology) {
    console.log("Received parameters:", {projectid, teamNum, technology});

    // Validate input more rigorously
    if (!projectid || !teamNum || ! technology) {
        console.error("Missing required parameters");
        return {
            status: 422,
            message: "Invalid technology data",
        };
    }

    try {
        const result = await pool.query(
            `
        INSERT INTO technology (Project_ID , Team_Num , technology)  
            VALUES ($1, $2 , $3)
        `,
            [projectid , teamNum , technology]
        );

        console.log("Database insertion result:", result);

        return {
            status: 201,
            message: "technology add successfully",
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
                message: "technology already exist",
            };
        }

        return {
            status: 500,
            message: "Database insertion failed",
            error: err.message,
        };
    }
}
