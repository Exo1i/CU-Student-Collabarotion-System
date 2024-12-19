import pool from "@/lib/db";
import {NextResponse} from "next/server";

//get all Projects
export async function GET(request) {
  const resp = await pool.query("SELECT * FROM Project");
  return NextResponse.json(resp.rows, { status: 200 });
}

// //create a new project
// export async function POST(request) {
//   try {
//     const { name, coursecode, endDate, description, maxSize } =
//       await request.json();

//     const query =
//       "INSERT INTO Project (Project_Name, Course_Code, End_Date, Description, Max_team_size) VALUES ($1, $2, $3, $4, $5)";
//     const values = [name, coursecode, endDate, description, maxSize];
//     await pool.query(query, values);
//     return NextResponse.json({ message: "Project created" }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to create Project" },
//       {
//         status: 500,
//       }
//     );
//   }
// }
