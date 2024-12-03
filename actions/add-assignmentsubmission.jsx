import pool from "@/lib/db";
export async function addAssignmentSubmission(subID, assignmentID) {
        if (!subID || !assignmentID) {
            // TODO : create a error handller that display pop-up error message
            return {
                status: 422, message: 'Invalid user data'
            };
        }
        try {
            const res = await pool.query(`insert into assignmentsubmission (submission_id, assignment_id) 
                values ($1 , $2)` , [subID, assignmentID]);
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