'use server'

import {auth} from '@clerk/nextjs/server'

export const getRole = async () => {
    const { sessionClaims, userId} = await auth()
    if (!userId) return 'guest';
    console.log(sessionClaims + userId );
    if (sessionClaims?.metadata?.role === 'admin') return "admin"
    else if(sessionClaims?.metadata?.role === 'instructor') return "instructor"
    else return 'student'

}