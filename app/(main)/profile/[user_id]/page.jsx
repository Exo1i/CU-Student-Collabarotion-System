import Profile from "@/app/(main)/profile/Profile";
import {getRole} from "@/lib/role";

export default async function Page({params}) {
    const {user_id} = await params
    console.log(user_id);
    const role = await getRole();
    return <Profile userID={user_id} role={role} myprofile={false} />;
}