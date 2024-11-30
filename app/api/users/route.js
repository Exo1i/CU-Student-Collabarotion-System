"use server";
import pool from "../../../lib/db";
import { NextResponse } from "next/server";

//get all users
export async function GET(request) {
  const resp = await pool.query("SELECT * from Users");
  return NextResponse.json(resp.rows, { status: 200 });
}

//create a new user
export async function POST(request) {
  try {
    console.log("Received POST request:", request); // Read the request body
    const bodyText = await request.text();
    console.log("Raw body text:", bodyText);
    const body = JSON.parse(bodyText);
    console.log("Parsed request body:", body);
    const { userId, fname, lname, role } = body;
    console.log("Parsed values:", { userId, fname, lname, role });
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    const query = ` INSERT INTO Users (User_ID, Fname, Lname, Role) VALUES ($1, $2, $3, $4) `;
    const values = [userId, fname, lname, role];
    console.log("Executing query:", query, "with values:", values);
    await pool.query(query, values);
    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (err) {
    console.error("Error creating user:", err);
    return NextResponse.json(
      { error: "Failed to create user" },
      {
        status: 500,
      }
    );
  }
}
