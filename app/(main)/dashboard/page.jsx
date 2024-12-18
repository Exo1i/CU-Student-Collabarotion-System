import {getRole} from "@/lib/role";
import InstructorPage from "@/app/(main)/dashboard/instructor/InstructorPage";
import {redirect} from "next/navigation";
import AdminPageWrapper from "./AdminPageWrapper";
import StudentPage from "@/app/(main)/dashboard/student/StudentPage";

export default async function Page() {
    const role = await getRole()

    if (role === "guest") {
        redirect('/')
    } else if (role === "admin") {
        return <AdminPageWrapper />
    } else if (role === "instructor") {
        return <InstructorPage />
    } else return <StudentPage />
}
