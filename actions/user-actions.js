'use server'
import pool from "@/lib/db";

export async function addUser(userId, username, fname, lname, role) {
    let userObj = await clerkclient.users.getUser(userId)
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