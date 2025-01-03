import pool from "@/lib/db";
import { NextResponse } from "next/server";

// get a Project and all its teams given its id
export async function GET(request, { params }) {
  try {
    const par = await params;
    const projectDetails = await pool.query(
      `SELECT Project_ID, Project_Name, Max_team_size, description, start_date, end_date
       FROM Project 
       WHERE Project_ID = $1;`,
      [par.projectid]
    );

    // console.log("Project Details:", projectDetails.rows[0]);

    const maxNumTeams = await pool.query(
      `SELECT CEIL(CAST(COUNT(u.User_ID) AS FLOAT) / (p.Max_team_size)) AS max_teams
       FROM Users u, Project p
       WHERE p.Project_ID = $1 AND u.role = 'student'
       GROUP BY p.Project_ID;`,
      [par.projectid]
    );

    // console.log("maxNumTeams:", maxNumTeams.rows[0]);

    const teamDetails = await pool.query(
      `SELECT Team_Num, Team_Name 
       FROM Team 
       WHERE Project_ID = $1;`,
      [par.projectid]
    );

    // console.log("Team Details:", teamDetails.rows);

    const teamAvailability = await pool.query(
      `SELECT Team.Team_Num, Max_team_size - COUNT(student_ID) AS Available_Slots
       FROM Team
       LEFT JOIN participation ON Team.Project_ID = participation.Project_ID AND Team.Team_Num = participation.Team_Num
       JOIN Project ON Team.Project_ID = Project.Project_ID 
       WHERE Team.Project_ID = $1
       GROUP BY Team.Team_Num, Max_team_size;`,
      [par.projectid]
    );

    // console.log("Team Availability:", teamAvailability.rows);

    const teamProgress = await pool.query(
      `SELECT t.team_num, COALESCE(SUM(DISTINCT ph.phase_load), 0) as progress
FROM team t
LEFT JOIN participation p ON t.team_num = p.team_num AND t.project_id = p.project_id AND p.leader = TRUE
LEFT JOIN submission s ON p.student_id = s.student_id
LEFT JOIN phasesubmission ps ON s.submission_id = ps.submission_id AND ps.project_id = t.project_id
LEFT JOIN phase ph ON ps.project_id = ph.project_id AND ps.phase_num = ph.phase_num
WHERE t.project_id = $1
GROUP BY t.team_num
ORDER BY t.team_num;`,
      [par.projectid]
    );

    // console.log("Team Progress:", teamProgress.rows);

    const technologies = await pool.query(
      `SELECT te.team_num, array_agg(t.technology) AS technologies
       FROM technology t
       JOIN team te ON t.project_id = te.project_id AND t.team_num = te.team_num
       WHERE te.project_id = $1
       GROUP BY te.team_num;`,
      [par.projectid]
    );

    // console.log("Technologies:", technologies.rows);

    const teamMembersQuery = await pool.query(
      `SELECT Team.Team_Num, concat(fname,' ',lname) as full_name, img_url, leader , User_ID
       FROM Team 
       JOIN participation ON Team.Project_ID = participation.Project_ID AND Team.Team_Num = participation.Team_Num
       JOIN Users ON participation.student_ID = Users.User_ID
       WHERE Team.Project_ID = $1;`,
      [par.projectid]
    );

    // console.log("Team Members Query:", teamMembersQuery.rows);

    const teamMembers = teamMembersQuery.rows.reduce((acc, row) => {
      if (!acc[row.team_num]) {
        acc[row.team_num] = [];
      }
      acc[row.team_num].push({
        full_name: row.full_name,
        img: row.img_url,
        leader: row.leader,
        user_id: row.user_id
      });
      return acc;
    }, {});

    // console.log("Team Members Aggregated:", teamMembers);

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
        const technology = technologies.rows.find(
          (tt) => tt.team_num === team.team_num
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
          technologies: technology ? technology.technologies : [],
          teamMembers: members,
        };
      }),
    };

    // console.log("Final Response:", resp);

    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    console.error("Error fetching Project:", error);
    return NextResponse.json(
      { error: "Failed to fetch Project" },
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
