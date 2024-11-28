import pool from "../../../../lib/db";
import { NextResponse } from "next/server";

//get a chatgroup given their ID
export async function GET(request, { params }) {
  try {
    const par = await params;
    const resp = await pool.query(
      "SELECT * FROM Chat_Group WHERE Group_ID = $1",
      [par.groupid]
    );
    if (resp.rows.length === 0) {
      return NextResponse.json(
        { error: "Chatgroup not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(resp.rows[0], { status: 200 });
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
    return NextResponse.json({ message: "Chatgroup deleted" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting chatgroup: ", err);
    return NextResponse.json(
      { error: "Failed to delete chatgroup" },
      { status: 500 }
    );
  }
}
