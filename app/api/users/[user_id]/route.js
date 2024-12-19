import pool from "@/lib/db";
import {NextResponse} from "next/server";

//get a user given their ID
export async function GET(request, {params}) {
    try {
        const par = await params;
        const resp = await pool.query("SELECT * FROM Users WHERE User_ID = $1", [
            par.user_id,
        ]);
        if (resp.rows.length === 0) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }
        return NextResponse.json(resp.rows[0], {status: 200});
    } catch (err) {
        console.error("Error fetching user:", err);
        return NextResponse.json(
            {error: "Failed to fetch user"},
            {status: 500}
        );
    }
}
