import pool from "../../../../../../lib/db";
import { NextResponse } from "next/server";

//get a channel given the chatgroup id and the channel number
export async function GET(request, { params }) {
  try {
    const par = await params;
    const resp = await pool.query(
      "SELECT * FROM Channel WHERE Group_ID = $1 AND Channel_Num = $2",
      [par.groupid, par.channelnum]
    );
    if (resp.rows.length === 0) {
      return NextResponse.json({ error: "channel not found" }, { status: 404 });
    }
    return NextResponse.json(resp.rows[0], { status: 200 });
  } catch (err) {
    console.error("Error fetching channel:", err);
    return NextResponse.json(
      { error: "Failed to fetch channel" },
      { status: 500 }
    );
  }
}

// Update a row in the Channel table given the chatgroup id and the channel number
export async function PUT(request, { params }) {
  try {
    const par = await params;
    const { name, type } = await request.json();
    await pool.query(
      "UPDATE Channel SET Channel_Name = $1, Channel_Type = $2 WHERE Group_ID = $3 AND Channel_Num = $4",
      [name, type, par.groupid, par.channelnum]
    );
    return NextResponse.json({ message: "Channel updated" }, { status: 200 });
  } catch (err) {
    console.error("Error updating channel:", err);
    return NextResponse.json(
      { error: "Failed to update channel" },
      { status: 500 }
    );
  }
}

//delete a specific channel given its number and group id
export async function DELETE(request, { params }) {
  try {
    const par = await params;
    await pool.query(
      "DELETE FROM Channel WHERE Group_ID = $1 AND Channel_Num = $2",
      [par.groupid, par.channelnum]
    );
    return NextResponse.json({ message: "Channel deleted" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting Channel: ", err);
    return NextResponse.json(
      { error: "Failed to delete Channel" },
      { status: 500 }
    );
  }
}
