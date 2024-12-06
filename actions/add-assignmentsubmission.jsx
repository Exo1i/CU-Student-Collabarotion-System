'use server'
import { auth } from '@clerk/nextjs/server'
import pool from "@/lib/db";
import { redirect } from 'next/navigation';

export async function addAssignmentSubmission(assignmentID) {
    const { userId } = await auth();
    if (!userId) redirect('/signin');

    if (!assignmentID) {
        // TODO : create a error handller that display pop-up error message
        return {
            status: 422, message: 'Invalid user data'
        };
    }
    try {
        const Submission_ID = Math.random().toPrecision(21) * 10105 % 13
        const res = (await pool.query(`INSERT INTO Submission (Submission_ID ,  Type, Student_ID) VALUES 
            ($1,'assignment',$2 );` , [Submission_ID, userId])).then(async res => {
            return await pool.query(` INSERT INTO AssignmentSubmission (Submission_ID, Assignment_ID) VALUES ($1, $2)`, [Submission_ID, assignmentID]);
        }).catch(err => console.error(err));
        if (res.rowCount > 0) {
            return {
                status: 201,
                message: 'Assignment submission added successfully',
            };
        } else {
            return {
                status: 500,
                message: 'Failed to add assignment submission',
            }
        }
    } catch (err) {
        console.error('Database error:', err);
        return {    
            status: 500,
            message: 'An error occurred while adding the assignment submission',
        };
    }
}