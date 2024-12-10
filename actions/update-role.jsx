'use server'
import pool from "@/lib/db";

export async function updateRole(userId, role) {
    console.log('Received parameters:', { userId, role });

    // Validate input more rigorously
    if (!userId || !role) {
        console.error('Missing required parameters');
        return {
            status: 422, message: 'Invalid user data'
        };
    }

    try {
        const result = await pool.query(`
            Update Users set role = $1 where user_id = $2;            
        `, [userId, role]);

        console.log('Database update result:', result);

        return {
            status: 200, message: "User updated successfully",
        };
    } catch (err) {
        console.error('Detailed error:', {
            message: err.message, code: err.code, detail: err.detail, stack: err.stack
        });

        return {
            status: 500, message: 'Database update failed', error: err.message
        };
    }
}