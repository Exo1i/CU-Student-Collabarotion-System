import {auth} from "@clerk/nextjs/server";

export const getRole = () => {
    const {userId, orgId} = auth()

    if (!userId) return 'guest'

    return orgId === 'org_2lmzwqixfnpI2AJUqa9dWnjYogm'
}