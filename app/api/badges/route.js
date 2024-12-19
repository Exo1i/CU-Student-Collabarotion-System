import pool from "@/lib/db";
import {NextResponse} from "next/server";

//get student's profile
export async function GET(request,) {
    try {

        const badges = await pool.query(`SELECT * FROM Badge`);

        const resp = {
            badges: badges.rows
        };

        return NextResponse.json(resp, {status: 200});
    } catch (error) {
        console.error("Error fetching badges:", error);
        return NextResponse.json({error: "Failed to fetch badges"}, {status: 500});
    }
}
