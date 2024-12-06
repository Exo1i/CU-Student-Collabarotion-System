import pool from "../../../../lib/db";
import { NextResponse } from "next/server";

//get a user given their ID
export async function GET(request, { params }) {
  try {
    const par = await params;
    const resp = await pool.query("SELECT * FROM Users WHERE User_ID = $1", [
      par.user_id,
    ]);
    if (resp.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(resp.rows[0], { status: 200 });
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// Update a row in the users table given the users's ID
export async function PUT(request, { params }) {
  try {
    const par = await params;
    const { fname, lname, role } = await request.json();
    await pool.query(
      "UPDATE Users SET Fname = $1, Lname = $2, Role = $3 WHERE User_ID = $4",
      [fname, lname, role, par.user_id]
    );
    return NextResponse.json({ message: "User updated" }, { status: 200 });
  } catch (err) {
    console.error("Error updating user:", err);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

//delete a specific user given their ID
export async function DELETE(request, { params }) {
  try {
    const par = await params;
    await pool.query("DELETE FROM Users WHERE User_ID = $1", [par.user_id]);
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting user: ", err);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

// edit specific values for a certain user given their ID
export async function PATCH(request, { params }) {
  try {
    const par = await params;
    const updates = await request.json();
    const updateFields = Object.keys(updates) //Reads the update fields from the request body.
      .map((key, index) => `${key} = $${index + 1}`) //preparing the query updates
      .join(", ");
    const updateValues = [...Object.values(updates), par.user_id];
    await pool.query(
      `UPDATE Users SET ${updateFields} WHERE User_ID = $${updateValues.length}`,
      updateValues
    );
    return NextResponse.json(
      { message: "User partially updated" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating user:", err);
    return NextResponse.json(
      { error: "Failed to partially update user" },
      { status: 500 }
    );
  }
}
