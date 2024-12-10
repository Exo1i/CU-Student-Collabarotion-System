// import 'server-only'
'use server'
import pool from "@/lib/db";

import {auth} from "@clerk/nextjs/server";

export async function insertMessage(groupId, channelNum, content, type) {
    const {userId} = await auth();
    if (!userId) {
        return {
            message: "Unauthorized!", status: 400
        };
    }

    try {
        const result = await pool.query("INSERT INTO Message (Group_ID, Channel_Num, Content, Sender_ID, Type) VALUES ($1, $2, $3, $4, $5) RETURNING *", [groupId, channelNum, content, userId, type]);

        const insertedMessage = result.rows[0]; // Extract the first (and only) returned row
        return {
            message: "Added Message Successfully", status: 201, data: insertedMessage // Include the inserted message with Message_ID in the response
        };
    } catch (error) {
        console.error("Error creating message:", error);
        return {
            error: `Failed to create message, ${error}`, status: 500
        };
    }
}

export async function editMessage(messageID, newContent) {
    const {userId} = await auth();
    if (!userId) {
        return {
            message: "Unauthorized!", status: 400
        };
    }

    try {
        const result = await pool.query('UPDATE message SET CONTENT=$2 where message_id=$1', [messageID, newContent]);

        return {
            message: "Updated Message Successfully", status: 201,
        };
    } catch (error) {
        console.error("Error edit message:", error);
        return {
            error: `Failed to edit message, ${error}`, status: 500
        };
    }
}

export async function deleteMessage(messageId) {
    const {userId, sessionClaims} = await auth();
    if (!userId) return {
        message: "Unauthorized!",
        status: 400
    }
    ///@TODO: Verify if the user is an admin or the message sender
    try {
        await pool.query("DELETE FROM Message WHERE Message_ID = $1", [messageId]);
        return {
            message: "Message deleted",
            status: 200
        };
    } catch (err) {
        console.error("Error deleting Message: ", err);
        return {
            error: "Failed to delete Message",
            status: 500
        };
    }
}