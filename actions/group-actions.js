// import 'server-only'
'use server'

import pool from "@/lib/db";

const {createHash} = require('crypto');

export async function renameGroup(newGroupName, groupId) {
    try {
        await pool.query("UPDATE Chat_Group SET Group_Name = $1 WHERE Group_ID = $2", [newGroupName, groupId]);
        return {message: "chatgroup updated", status: 200}
    } catch (err) {
        console.error("Error updating chatgroup:", err);
        return {
            error: "Failed to update chatgroup", status: 500
        }
    }
}

export async function deleteGroup(groupid) {
    try {
        await pool.query("DELETE FROM Chat_Group WHERE Group_ID = $1", [groupid,]);
        return {
            message: "Chatgroup and its channels deleted", status: 200
        };
    } catch (err) {
        console.error("Error deleting chatgroup: ", err);
        return {
            error: "Failed to delete chatgroup", status: 500
        };
    }
}

export async function createGroup(groupName) {

    if (!groupName) return {
        message: "group name is required", status: 400
    }

    try {
        await pool.query("INSERT INTO chat_group (Group_Name) VALUES ($1)", [groupName]);
        return {
            message: "Group Added Successfully", status: 200
        };
    } catch (error) {
        return {
            message: `Failed to create chatgroup,${error}`, status: 500
        }
    }
}