'use server';
import { auth } from '@clerk/nextjs/server';
import pool from "@/lib/db";
import { redirect } from 'next/navigation';


export async function addAssignmentSubmission(assignmentID, url) {
    const { userId } = await auth();
    console.log(`Data for assignment submission: assignmentID=${assignmentID}, userId=${userId}, url=${url}`);

    if (!userId) redirect('/signin');
    if (!assignmentID || !url) {
        return {
            status: 422,
            message: 'Invalid assignment submission data',
        };
    }
    try {
        const submissionQuery = `INSERT INTO Submission (Type, Student_ID , submissionurl ) VALUES ('assignment', $1 , $2) RETURNING submission_id`;
        const submissionResult = await pool.query(submissionQuery, [userId , url]);
        if (submissionResult.rowCount === 0) {
            throw new Error('Failed to insert submission');
        }
        console.log(`Data for submission submission_id:` + submissionResult.rows[0].submission_id);
        const Submission_ID = submissionResult.rows[0].submission_id;

        const assignmentSubmissionQuery = `INSERT INTO AssignmentSubmission (Submission_ID, Assignment_ID) VALUES ($1, $2)`;
        const assignmentSubmissionResult = await pool.query(assignmentSubmissionQuery, [Submission_ID, assignmentID]);
        if (assignmentSubmissionResult.rowCount === 0) {
            throw new Error('Failed to insert assignment submission');
        }

        // const attachmentQuery = `INSERT INTO Attachment (URL) VALUES ($1) RETURNING attachment_id`;
        // const attachmentResult = await pool.query(attachmentQuery, [url]);
        // if (attachmentResult.rowCount === 0) {
        //     throw new Error('Failed to insert attachment');
        // }
        // const attachmentid = attachmentResult.rows[0].attachment_id;
        // const submissionattachmentQuery = `INSERT INTO submissionAttachment (Attachment_ID, Submission_ID) VALUES ($1 , $2) `;
        // const submissionattachmentResult = await pool.query(submissionattachmentQuery, [attachmentid, Submission_ID]);
        // if (submissionattachmentResult.rowCount === 0) {
        //     throw new Error('Failed to insert submissionattachment');
        // }

        return {
            status: 201,
            message: 'Assignment submission added successfully',
        };

    } catch (err) {
        console.error('Database error:', err);
        return {
            status: 500,
            message: 'An error occurred while adding the assignment submission',
        };
    }
}
