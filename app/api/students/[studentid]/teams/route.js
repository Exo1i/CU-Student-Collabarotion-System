import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const par = await params;
    const teams = await pool.query(
      ` SELECT t.Team_Num, t.Team_Name, t.Project_ID, pr.project_name, pr.course_code
        FROM participation p
        join Team t on p.Project_ID = t.Project_ID AND p.Team_Num = t.Team_Num
        join project pr on pr.project_id = p.project_id       
        WHERE p.student_ID = $1;
       `,
      [par.studentid]
    );

    for (const team of teams.rows) {
      const course = await pool.query(
        `select course_name from course where course_code = $1`,
        [team.course_code]
      );
      const teamMembers = await pool.query(
        ` SELECT u.User_ID AS member_id, concat(u.fname,' ',u.lname) as full_name, u.img_url
          FROM participation ppart
          JOIN Users u ON ppart.student_ID = u.User_ID
          WHERE ppart.Project_ID = $1 AND ppart.Team_Num = $2;
         `,
        [team.project_id, team.team_num]
      );
      const teamLeader = await pool.query(
        `SELECT u.User_ID as leader_id, concat(u.fname,' ',u.lname) as full_name, u.img_url
         FROM participation p
         JOIN Users u ON p.student_ID = u.User_ID
         JOIN Team t on  p.Team_Num = t.Team_Num AND p.Project_ID = t.Project_ID
         WHERE p.leader = TRUE and t.project_id = $1 and t.Team_num = $2;
        `,
        [team.project_id, team.team_num]
      );
      const teamProgress = await pool.query(
        `SELECT COALESCE(SUM(Phase_load), 0) AS Progress
         FROM PhaseSubmission
         JOIN Phase ON PhaseSubmission.Project_ID = Phase.Project_ID AND PhaseSubmission.Phase_Num = Phase.Phase_Num
         JOIN Submission ON PhaseSubmission.Submission_ID = Submission.Submission_ID
         WHERE PhaseSubmission.Project_ID = $1 and Submission.student_id = $2;
         `,
        [team.project_id, teamLeader.rows[0].leader_id]
      );
      team.course = course.rows[0].course_name;
      team.members = teamMembers.rows;
      team.leader = teamLeader.rows[0];
      team.progress = teamProgress.rows[0].progress;
    }

    return NextResponse.json(teams.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching student teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}
