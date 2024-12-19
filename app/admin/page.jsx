'use server'
import NotFound from "next/dist/client/components/not-found-error";
import {getRole} from "@/lib/role";
import AdminPageWrapper from "@/app/admin/AdminPageWrapper";

const adminPage = async () => {
    const role = await getRole();
    if (role !== 'admin') return (<NotFound />)

    return (<AdminPageWrapper />)
}
export default adminPage;