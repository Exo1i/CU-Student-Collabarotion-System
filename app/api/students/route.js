import pool from "@/lib/db";
import { NextResponse } from "next/server";

//get number of studens (and a list of the students (may not be needed))
export async function GET(request) {
  const list = await pool.query("SELECT * From Users WHERE role = $1", [
    "student",
  ]);
  if (list.rowCount === 0) NextResponse.json("no students in the system");

  const num = await pool.query(
    "SELECT COUNT(user_id) FROM Users WHERE role = $1",
    ["student"]
  );

  const resp = { ...num.rows[0], students_list: list.rows };
  return NextResponse.json(resp, { status: 200 });
}
