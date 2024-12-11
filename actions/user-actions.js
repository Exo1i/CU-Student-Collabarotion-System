'use server'
import pool from "@/lib/db";
import {createClerkClient} from '@clerk/backend'

const clerkClient = createClerkClient({secretKey: process.env.CLERK_SECRET_KEY})

export async function addUser(userId, username, fname, lname, role) {

    let userObj = await clerkClient.users.getUser(userId)
    let img_url = userObj.imageUrl;

    console.log('Received parameters:', {userId, username, fname, lname, role, img_url});

    // Validate input more rigorously
    if (!userId || !fname || !lname || !role) {
        console.error('Missing required parameters');
        return {
            status: 422, message: 'Invalid user data'
        };
    }

    try {
        const result = await pool.query(`
            INSERT INTO users (user_id,username ,fname, lname, role,img_url) 
            VALUES ($1,$2, $3, $4, $5,$6)
        `, [userId, username, fname, lname, role, img_url]);

        console.log("Database insertion result:", result);

        return {
            status: 200,
            message: "User added successfully",
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
                message: "User already exists",
            };
        }

        return {
            status: 500,
            message: "Database insertion failed",
            error: err.message,
        };
    }
}

export async function fetchUserData(user_id) {
    // Validate input more rigorously
    if (!user_id) {
        console.error('Missing required parameter, user_id');
        return {
            status: 422, message: 'user_id is required'
        };
    }

    return await fetch(`/api/users/${user_id}`)
}

export async function updateUser(userData) {
    // Basic validation checks
    if (!userData.user_id) {
        return {
            status: 422,
            message: "User ID is required"
        };
    }

    // Validate first and last names
    if (!userData.fname || userData.fname.trim().length < 1 || userData.fname.length > 50) {
        return {
            status: 422,
            message: "First name is required and must be less than 50 characters"
        };
    }

    if (!userData.lname || userData.lname.trim().length < 1 || userData.lname.length > 50) {
        return {
            status: 422,
            message: "Last name is required and must be less than 50 characters"
        };
    }

    // Optional username validation
    if (userData.username) {
        if (userData.username.length < 2 || userData.username.length > 50) {
            return {
                status: 422,
                message: "Username must be between 2 and 50 characters"
            };
        }
    }

    // Optional image URL validation
    if (userData.img_url) {
        try {
            new URL(userData.img_url);
        } catch {
            return {
                status: 422,
                message: "Invalid image URL"
            };
        }
    }

    try {

        // Prepare Clerk update data
        const clerkUpdateData = {
            firstName: userData.fname,
            lastName: userData.lname,
        };

        // Add username if it's being changed
        if (userData.username) {
            clerkUpdateData.username = userData.username;
        }

        // Update user in Clerk
        const updatedClerkUser = await clerkClient.users.updateUser(
            userData.user_id,
            clerkUpdateData
        );

        // Update user in local database
        const result = await pool.query(`
      UPDATE users 
      SET 
        username = COALESCE($2, username),
        fname = $3,
        lname = $4,
        img_url = COALESCE($5, img_url)
      WHERE user_id = $1
      RETURNING *
    `, [
            userData.user_id,
            userData.username,
            userData.fname,
            userData.lname,
            userData.img_url
        ]);

        return {
            status: 200,
            message: "User updated successfully",
            data: result.rows[0]
        };
    } catch (error) {
        console.error("Update user error:", error);

        // Handle unique constraint violations
        if (error.code === '23505') {
            return {
                status: 409,
                message: "Unique constraint violation"
            };
        }

        return {
            status: 500,
            message: "Failed to update user",
            error: error.message
        };
    }
}
