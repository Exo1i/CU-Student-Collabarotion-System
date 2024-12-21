'use server'
import pool from "@/lib/db";

export async function addCourse(course_code, course_name, instructor_id, max_grade, course_img, description) {
    console.log('Received parameters:', {course_code, course_name, instructor_id, max_grade, course_img, description});

    // Validate input more rigorously
    if (!course_code || !course_name || !max_grade) {
        console.error('Missing required parameters');
        return {
            status: 422, message: 'Invalid Course data'
        };
    }

    try {
        const instructor = await pool.query(`select role from users where user_id = $1`, [instructor_id]);

        if (instructor.rowCount === 0)
            return {message: 'instructor does not exist'}

    } catch (err) {
        console.error('Detailed error:', {
            message: err.message, code: err.code, detail: err.detail, stack: err.stack
        });
    }

    try {
        const result = await pool.query(`
           INSERT INTO Course (Course_Code, Course_Name, Instructor_ID, max_Grade, course_img, description) VALUES ($1, $2, $3, $4, $5, $6);
        `, [course_code, course_name, instructor_id, max_grade, course_img, description]);

        console.log('Database insertion result:', result);

        return {
            status: 200, message: "Course added successfully",
        };
    } catch (err) {
        console.error('Detailed error:', {
            message: err.message, code: err.code, detail: err.detail, stack: err.stack
        });

        if (err.code === '23505') {  // Unique constraint violation
            return {
                status: 409,  // Conflict
                message: 'Course already exists'
            };
        }

        return {
            status: 500, message: 'Database insertion failed', error: err.message
        };
    }
}