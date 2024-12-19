import pool from "@/lib/db";
import {NextResponse} from "next/server";

export async function GET(req, { params }) {
  const { userid } = await params;
  const resp = await pool.query(`SELECT role FROM users WHERE user_id = $1;`, [
    userid,
  ]);
  if (resp.rowCount === 0)
    return NextResponse.json("User ID not found", { status: 404 });

  return NextResponse.json(resp.rows, { status: 200 });
}
