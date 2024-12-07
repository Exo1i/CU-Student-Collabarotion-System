import pool from "@/lib/db";
import { NextResponse } from "next/server";

//get a Project and all its teams given its id
export async function GET(request, { params }) {
  try {
    const par = await params;
    const projectDetails = await pool.query(
      ` SELECT Project_ID, Project_Name, Max_team_size, description, start_date, end_date
        FROM Project WHERE Project_ID = $1;
       `,
      [par.projectid]
    );

    console.log("Project Details:", projectDetails.rows[0]);

    const maxNumTeams = await pool.query(
      `SELECT CEIL(CAST(COUNT(u.User_ID) AS FLOAT) / (p.Max_team_size)) AS max_teams
       FROM Users u, Project p
       WHERE p.Project_ID = $1 AND u.role = 'student'
       GROUP BY p.Project_ID;`,
      [par.projectid]
    );

    console.log("maxNumTeams:", maxNumTeams[0]);

    const teamDetails = await pool.query(
      `SELECT Team_Num, Team_Name FROM Team WHERE Project_ID = $1`,
      [par.projectid]
    );

    console.log("Team Details:", teamDetails.rows);

    const teamAvailability = await pool.query(
      ` SELECT Team.Team_Num, Max_team_size - COUNT(student_ID) AS Available_Slots
        FROM Team
        LEFT JOIN participation ON Team.Project_ID = participation.Project_ID AND Team.Team_Num = participation.Team_Num
        JOIN Project ON Team.Project_ID = Project.Project_ID WHERE Team.Project_ID = $1
        GROUP BY Team.Team_Num, Max_team_size`,
      [par.projectid]
    );

    console.log("Team avilability:", teamAvailability.rows);

    const teamProgress = await pool.query(
      ` SELECT Team_Num, COALESCE(SUM(Phase_load), 0) AS Progress
        FROM PhaseSubmission
        JOIN Phase ON PhaseSubmission.Project_ID = Phase.Project_ID AND PhaseSubmission.Phase_Num = Phase.Phase_Num
        JOIN Submission ON PhaseSubmission.Submission_ID = Submission.Submission_ID
        JOIN participation ON Submission.Student_ID = participation.student_ID AND participation.Leader = TRUE
        WHERE PhaseSubmission.Project_ID = $1 GROUP BY Team_Num`,
      [par.projectid]
    );

    console.log("Team Progress:", teamProgress.rows);

    const teamMembersQuery = await pool.query(
      ` SELECT Team.Team_Num, fname, lname, img_url, leader
        FROM Team JOIN participation ON Team.Project_ID = participation.Project_ID AND Team.Team_Num = participation.Team_Num
        JOIN Users ON participation.student_ID = Users.User_ID
        WHERE Team.Project_ID = $1 `,
      [par.projectid]
    );

    console.log("Team Members Query:", teamMembersQuery.rows);

    const teamMembers = teamMembersQuery.rows.reduce((acc, row) => {
      if (!acc[row.team_num]) {
        acc[row.team_num] = [];
      }
      acc[row.team_num].push({
        fname: row.fname,
        lname: row.lname,
        img: row.img_url,
        leader: row.leader,
      });
      return acc;
    }, {});

    console.log("Team Members Aggregated:", teamMembers);

    const resp = {
      ...projectDetails.rows[0],
      ...maxNumTeams.rows[0],
      teams: teamDetails.rows.map((team) => {
        const availability = teamAvailability.rows.find(
          (ta) => ta.team_num === team.team_num
        );
        const progress = teamProgress.rows.find(
          (tp) => tp.team_num === team.team_num
        );
        const members = teamMembers[team.team_num]
          ? teamMembers[team.team_num]
          : [];
        return {
          ...team,
          availableSlots: availability
            ? availability.available_slots
            : projectDetails.rows[0].max_team_size,
          progress: progress ? progress.progress : 0,
          teamMembers: members,
        };
      }),
    };

    console.log("Final Response:", resp);

    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    console.error("Error fetching Project:", error);
    return NextResponse.json(
      { error: "Failed to fetch Project" },
      { status: 500 }
    );
  }
}

//delete a Project given its id
export async function DELETE(request, { params }) {
  try {
    const par = await params;
    const resp = await pool.query("DELETE FROM Project WHERE Project_ID= $1", [
      par.projectid,
    ]);
    return NextResponse.json("Project deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting Project: ", error);
    return NextResponse.json(
      { error: "Failed to delete Project" },
      { status: 500 }
    );
  }
}

//update a enddate and maximum team size in a project
export async function PUT(request, { params }) {
  try {
    const par = await params;
    const { endDate, maxSize } = await request.json();

    await pool.query(
      "UPDATE Project SET End_Date = $1, Max_Team_Size = $2 WHERE Project_ID = $3",
      [endDate, maxSize, par.projectid]
    );
    return NextResponse.json({ message: "course updated" }, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

//add a new phase in a project
export async function POST(request, { params }) {
  try {
    const par = await params;
    const { number, name, load, deadline } = await request.json();

    await pool.query(
      "INSERT INTO phase (Project_ID, Phase_Num, Phase_Name, Phase_load, deadline) VALUES ($1, $2, $3, $4, $5)",
      [par.projectid, number, name, load, deadline]
    );
    return NextResponse.json({ message: "Phase created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create Phase" },
      { status: 500 }
    );
  }
}
