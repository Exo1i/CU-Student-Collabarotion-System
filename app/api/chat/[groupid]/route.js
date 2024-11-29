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

// Update a row in the chatgroup table given its ID
export async function PUT(request, { params }) {
  try {
    const par = await params;
    const { groupname } = await request.json();
    await pool.query(
      "UPDATE Chat_Group SET Group_Name = $1 WHERE Group_ID = $2",
      [groupname, par.groupid]
    );
    return NextResponse.json({ message: "chatgroup updated" }, { status: 200 });
  } catch (err) {
    console.error("Error updating chatgroup:", err);
    return NextResponse.json(
      { error: "Failed to update chatgroup" },
      { status: 500 }
    );
  }
}

//delete a specific chatgroup given its ID
export async function DELETE(request, { params }) {
  try {
    const par = await params;
    await pool.query("DELETE FROM Chat_Group WHERE Group_ID = $1", [
      par.groupid,
    ]);
    return NextResponse.json(
      { message: "Chatgroup and its channels deleted" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting chatgroup: ", err);
    return NextResponse.json(
      { error: "Failed to delete chatgroup" },
      { status: 500 }
    );
  }
}

//create a new channel in a chatgroup
export async function POST(request, { params }) {
  try {
    const par = await params;
    const { channelnum, name, type } = await request.json();

    await pool.query(
      "INSERT INTO Channel (Channel_Name, Channel_Num, Group_ID, Channel_Type) VALUES ($1, $2, $3, $4)",
      [name, channelnum, par.groupid, type]
    );
    return NextResponse.json({ message: "Channel created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create channel" },
      { status: 500 }
    );
  }
}
