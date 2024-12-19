"use server";
import pool from "@/lib/db";
import {auth} from '@clerk/nextjs/server';

export async function GiveReview(revieweeID, projectID, content, rating) {
    const { userId } = await auth();
    console.log("Received parameters:", { userId, revieweeID, projectID, content, rating });
    // Validate input more rigorously
    if (!userId || !revieweeID || !projectID || !content || !rating) {
        console.error("Missing required parameters");
        return {
            status: 422,
            message: "Invalid Team data",
        };
    }

    try {
        const result = await pool.query(
            `
        INSERT INTO review (reviewer_ID, reviewee_ID, Project_ID, content, rating)  
            VALUES ($1, $2, $3 , $4, $5)
        `,
            [userId, revieweeID, projectID, content, rating]
        );

        console.log("Database insertion result:", result);
        return {
            status: 201,
            message: "review added successfully",
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
            try {
                const result = await pool.query(
                    `
                update review 
                set  content = $4,
                rating = $5
                WHERE reviewer_ID = $1 
                AND reviewee_ID = $2 
                AND Project_ID = $3;  
                `,
                    [userId, revieweeID, projectID, content, rating]
                );

                console.log("Database update result:", result);
                return {
                    status: 200,
                    message: "review updated successfully",
                };
            } catch (err) {
                console.error("Detailed error:", {
                    message: err.message,
                    code: err.code,
                    detail: err.detail,
                    stack: err.stack,
                });
            };
        }

        return {
            status: 500,
            message: "Database insertion failed",
            error: err.message,
        };
    }
}
