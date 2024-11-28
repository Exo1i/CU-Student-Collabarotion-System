"use server";
import pool from "../../../lib/db";
import { NextResponse } from "next/server";

//get all chatgoups
export async function GET(request) {
  const resp = await pool.query("SELECT * FROM Chat_Group");
  return NextResponse.json(resp.rows, { status: 200 });
}

//create a new chatgroup
export async function POST(request) {
  try {
    const { groupid, groupname } = await request.json();
    if (!groupid) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );
    }
    await pool.query(
      "INSERT INTO chat_group (Group_ID, Group_Name) VALUES ($1, $2)",
      [groupid, groupname]
    );
    return NextResponse.json({ message: "Chatgroup created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create chatgroup" },
      {
        status: 500,
      }
    );
  }
}
