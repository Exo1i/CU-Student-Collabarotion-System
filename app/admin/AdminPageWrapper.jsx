'use client'

import dynamic from "next/dynamic";

const AdminPage = dynamic(
    () => import('@/app/admin/AdminPage'),
    {ssr: false}
);

export default function AdminPageWrapper() {
    return <AdminPage />
}
