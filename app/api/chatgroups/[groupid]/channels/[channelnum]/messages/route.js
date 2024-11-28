"use server";
import pool from "../../../../../../../lib/db";
import { NextResponse } from "next/server";

//get all messages in a certain channel
export async function GET(request, { params }) {
  const par = await params;
  const resp = await pool.query(
    "SELECT * FROM Message WHERE Group_ID = $1 AND Channel_Num = $2",
    [par.groupid, par.channelnum]
  );
  return NextResponse.json(resp.rows, { status: 200 });
}

//create a new message in a channel
export async function POST(request, { params }) {
  try {
    const par = await params;
    const { type, content, senderid } = await request.json();

    await pool.query(
      "INSERT INTO Message (Channel_Num, Group_ID, Type, Content, sender_ID) VALUES ($1, $2, $3, $4, $5)",
      [par.channelnum, par.groupid, type, content, senderid]
    );
    return NextResponse.json({ message: "message created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}
