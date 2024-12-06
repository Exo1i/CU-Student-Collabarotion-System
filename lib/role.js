import 'server-only'
import {auth} from "@clerk/nextjs/server";
import {fetchUserData} from "@/actions/user-actions";

'use server'

export const getRole = () => {
    const {userId, orgId} = auth()

    if (!userId) return 'guest'

    return fetchUserData;
}