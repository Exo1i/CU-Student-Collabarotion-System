'use server'

import {auth} from '@clerk/nextjs/server'

export const getRole = async () => {
    const {has, sessionClaims, userId} = await auth()
    if (!userId) return 'guest';
    return sessionClaims?.metadata?.role ?? 'student';
}