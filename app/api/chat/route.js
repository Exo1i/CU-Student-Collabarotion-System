"use server";
import pool from "../../../lib/db";
import { NextResponse } from "next/server";

//get all chatgoups
export async function GET(request) {
  const resp = await pool.query("SELECT * FROM Chat_Group ORDER BY Chat_Group.group_name ASC");
  return NextResponse.json(resp.rows, { status: 200 });
}
