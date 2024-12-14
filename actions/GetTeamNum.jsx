"use server";
import pool from "@/lib/db";
export async function getUserTeamNum(student_ID, Project_ID) {
    

    if (student_ID <= 0 || Project_ID <= 0) {
        console.error("Invalid ID values");
        return {
            status: 400, message: "ID values must be positive numbers.",
        };
    }

    try {
        const result = await pool.query(`SELECT team_num , leader FROM PARTICIPATION WHERE student_id = $1 AND project_id = $2`, [student_ID, Project_ID]);
        // Check if no rows found
        if (result.rows.length === 0) {
            return {
                status: 404, message: "No team found for this student in this project",student:null
            };
        }

        return {
            status: 200, message: "found team for this student" , student:result.rows[0]
        };
    } catch (err) {
        console.error("Database query error:", {
            message: err.message, code: err.code, detail: err.detail,
        });

        return {
            status: 500, message: "Error retrieving team information", error: err.message,
        };
    }
}