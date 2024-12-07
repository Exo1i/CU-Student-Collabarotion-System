import pool from "@/lib/db";
import { NextResponse } from "next/server";

//get student's profile
export async function GET(request, { params }) {
  try {
    const par = await params;
    const studentInfo = await pool.query(
      `SELECT User_ID AS student_id, Fname, Lname, img_url
       FROM  Users
       WHERE user_id= $1;`,
      [par.studentid]
    );

    const badges = await pool.query(
      `SELECT b.Badge_ID, b.Title, b.Description, eb.earned_at as date
       FROM  earnedBadges eb
       JOIN  Badge b ON eb.Badge_ID = b.Badge_ID
       WHERE eb.student_id = $1;`,
      [par.studentid]
    );

    const reviews = await pool.query(
      `SELECT r.content, r.rating, r.project_id, r.reviewer_id, u.Fname AS reviewer_fname, u.Lname AS reviewer_lname, u.img_url as reviewer_img 
       FROM review r
       JOIN Users u ON r.reviewer_ID = u.User_ID
       WHERE r.reviewee_id = $1;`,
      [par.studentid]
    );

    const teams = await pool.query(
      `SELECT t.Team_Num, p.Project_Name, part.leader
       FROM participation part
       JOIN team t ON part.Project_ID = t.Project_ID AND part.Team_Num = t.Team_Num
       JOIN Project p ON t.Project_ID = p.Project_ID
       WHERE part.student_ID = $1;`,
      [par.studentid]
    );

    const resp = {
      ...studentInfo.rows[0],
      badges: badges.rows,
      reviews: reviews.rows,
      teams: teams.rows,
    };

    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    console.error("Error fetching student student:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}