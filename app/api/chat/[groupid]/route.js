import pool from "../../../../lib/db";
import { NextResponse } from "next/server";

//get a chatgroup given their ID
export async function GET(request, { params }) {
  try {
    const par = await params;
    const groupinfo = await pool.query(
      "SELECT * FROM Chat_Group WHERE Group_ID = $1",
      [par.groupid]
    );
    if (groupinfo.rows.length === 0) {
      return NextResponse.json(
        { error: "Chatgroup not found" },
        { status: 404 }
      );
    }
    const groupchannels = await pool.query(
      "SELECT * FROM channel WHERE Group_ID = $1",
      [par.groupid]
    );
    const resp = { ...groupinfo.rows[0], channels: groupchannels.rows };
    return NextResponse.json(resp, { status: 200 });
  } catch (err) {
    console.error("Error fetching chatgroup:", err);
    return NextResponse.json(
      { error: "Failed to fetch chatgroup" },
      { status: 500 }
    );
  }
}
