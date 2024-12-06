// import 'server-only'
'use server'
import pool from "@/lib/db";
import {NextResponse} from "next/server";

import {auth} from "@clerk/nextjs/server";

export async function insertMessage(groupId, channelNum, content, type) {
    const {userId} = await auth();
    if (!userId) return {
        message: "Unauthorized!", status: 400
    }
    try {
        await pool.query("INSERT INTO Message (Group_ID, Channel_Num, Content, Sender_ID, Type) VALUES ($1, $2, $3, $4, $5) RETURNING *", [groupId, channelNum, content, userId, type]);
        return {message: "Added Message Successfully", status: 201};
    } catch (error) {
        console.error("Error creating message:", error);
        return {error: `Failed to create message,${error}`, status: 500};
    }
}

export async function deleteMessage(messageId) {
    const {userId} = await auth();
    if (!userId) return {
        message: "Unauthorized!", status: 400
    }
    try {
        await pool.query("DELETE FROM Message WHERE Message_ID = $1", [messageId]);
        return NextResponse.json({message: "Message deleted"}, {status: 200});
    } catch (err) {
        console.error("Error deleting Message: ", err);
        return NextResponse.json({error: "Failed to delete Message"}, {status: 500});
    }

}