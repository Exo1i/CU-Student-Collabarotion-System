'use server'

import {auth, clerkClient} from '@clerk/nextjs/server'

export const updateMetadata = async (metadata) => {
    const {userId, sessionClaims} = await auth()

    if (!userId) {
        return {message: 'No Logged In User'}
    }

    const client = await clerkClient()
    let newRole = metadata?.role;
    if (metadata?.role === "admin")
        newRole = "student"
    try {
        const res = await client.users.updateUser(userId, {
            publicMetadata: {
                ...sessionClaims?.metadata,
                ...metadata,
                role: newRole
            },
        })
        return {message: res.publicMetadata}
    } catch (err) {
        return {error: 'There was an error updating the user metadata.'}
    }
}

export const getMetadata = async () => {
    const {has, sessionClaims, userId} = await auth()
    if (!userId) return {};
    console.log(sessionClaims?.metadata)
    return sessionClaims?.metadata;
}