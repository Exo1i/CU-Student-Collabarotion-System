"use server";
import pool from "../../../lib/db";
import { NextResponse } from "next/server";

//get all chatgoups
export async function GET(request) {
  const resp = await pool.query("SELECT * FROM Chat_Group");
  return NextResponse.json(resp.rows, { status: 200 });
}
