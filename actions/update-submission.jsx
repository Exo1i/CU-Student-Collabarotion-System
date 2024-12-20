'use server';
import {auth} from '@clerk/nextjs/server';
import pool from "@/lib/db";
import {redirect} from 'next/navigation';

export async function updateSubmission( Submission_ID , url) {
    console.log(`Data for phase submission: submission id=${Submission_ID} ,   url=${url}`);
    const { userId } = await auth();
    if (!userId) redirect('/signin');
    if (!Submission_ID || !url) {
        return {
            status: 422,
            message: 'Invalid submission data',
        };
    }
    try {
        const submissionQuery = `update Submission set submissionurl=$1 where submission_id=$2`;
        const submissionResult = await pool.query(submissionQuery, [url , Submission_ID]);
        console.log("Database insertion result:", submissionResult);
        return {
            status: 200,
            message: 'submission updated successfully',
        };

    } catch (err) {
        console.error('Database error:', err);
        return {
            status: 500,
            message: 'An error occurred while update submiting a phase',
        };
    }
}
