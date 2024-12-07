'use server'

import {auth} from '@clerk/nextjs/server'

export const getRole = async () => {
    const {has, sessionClaims, userId} = await auth()
    if (!userId) return 'guest';
    if (sessionClaims?.metadata?.role === 'admin') return "admin"
    else return 'user'

}