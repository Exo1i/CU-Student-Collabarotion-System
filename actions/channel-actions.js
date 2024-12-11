// import 'server-only'
'use server'

import pool from "@/lib/db";

const {createHash} = require('crypto');

export async function createChannel(groupID, channelName, channelNum, type) {
    if (!groupID || !channelName || !type) {
        return {
            message: "All Fields are required!",
            status: 400
        }
    }

    try {
        await pool.query(
            "INSERT INTO Channel (Channel_Name, Channel_Num, Group_ID, Channel_Type) VALUES ($1, $2, $3, $4)",
            [channelName, channelNum, groupID, type]
        );
        return {
            message: "Channel created",
            status: 200
        }
    } catch (error) {
        return {
            message: `Failed To create channel,${error}`,
            status: 500
        };
    }

}

export async function deleteChannel(groupId, channelNum) {
    try {
        await pool.query(
            "DELETE FROM Channel WHERE Group_ID = $1 AND Channel_Num = $2",
            [groupId, channelNum]
        );
        return {message: "Channel deleted", status: 200}
    } catch (err) {
        console.error("Error deleting Channel: ", err);
        return {error: "Failed to delete Channel", status: 500}
    }
}

export async function updateChannel(name, type, groupId, channelNum) {
    try {
        await pool.query("UPDATE Channel SET Channel_Name = $1, Channel_Type = $2 WHERE Group_ID = $3 AND Channel_Num = $4", [name, type, groupId, channelNum]);
        return {message: "Channel updated", status: 200};
    } catch (err) {
        console.error("Error updating channel:", err);
        return {error: "Failed to update channel", status: 500};
    }
}
