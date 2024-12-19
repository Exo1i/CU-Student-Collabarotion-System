import Profile from "@/app/(main)/profile/Profile";
import {auth} from "@clerk/nextjs/server";
import {getRole} from "@/lib/role";

export default async function Page({params}) {
    const {userId,} = await auth()
    const role = await getRole();
    return <Profile userID={userId} role={role} myprofile={true} />;
}