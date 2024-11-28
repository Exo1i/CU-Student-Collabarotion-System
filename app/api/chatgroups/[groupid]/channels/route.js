"use server";
import pool from "../../../../../lib/db";
import { NextResponse } from "next/server";

//get all channels in a certain chatgroup
export async function GET(request, { params }) {
  const par = await params;
  const resp = await pool.query("SELECT * FROM Channel WHERE Group_ID = $1", [
    par.groupid,
  ]);
  return NextResponse.json(resp.rows, { status: 200 });
}

//create a new channel in a chatgroup
export async function POST(request, { params }) {
  try {
    const par = await params;
    const { name, number, type } = await request.json();
    if (!number) {
      return NextResponse.json(
        { error: "channel number is required" },
        { status: 400 }
      );
    }
    await pool.query(
      "INSERT INTO Channel (Channel_Name, Channel_Num, Group_ID, Channel_Type) VALUES ($1, $2, $3, $4)",
      [name, number, par.groupid, type]
    );
    return NextResponse.json({ message: "Channel created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create channel" },
      { status: 500 }
    );
  }
}
