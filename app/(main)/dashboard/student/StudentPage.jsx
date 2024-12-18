"use client";
import React from "react";
import Schedule from "@/components/schedule";
import { columns } from "@/app/(main)/dashboard/student/columns";
import { DataTable } from "@/app/(main)/dashboard/student/data_table";
import { CalendarDays, Notebook, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getUser } from "@/hooks/get-userID";
import { useAlert } from "@/components/alert-context";
import Loader from "@/components/Loader";
export default function StudentPage() {
  const { showAlert } = useAlert();
  const [assignData, setassigndata] = useState([]);
  const [loading, setloading] = useState(true);
  const user = getUser();

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const res = await fetch(`/api/students/user002/calendar`); //TODO ${user.id}
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        const assignments = data.assignments;
        setassigndata(assignments);
      } catch (error) {
        showAlert({
          message: error.message,
          severity: "error",
        });
      } finally {
        setloading(false);
      }
    }
    fetchStudentData();
  }, [user]);
  if (loading) return <Loader />;
  return (
    <div>
      <div className="h-full bh-white p-4 rounded-md">
        {/* schedule section */}
        <section>
          <div className="flex items-center  border-l-8 border-[#AB5BF7] bg-[#1A1A1A] text-white rounded w-max p-[10px] shadow-xl">
            <CalendarDays />
            <h1 className="text-3xl font-bold ml-2">Schedule</h1>
          </div>
          <p className="text-sm text-gray-600 my-2">
            Add your plans to the schedule to track them
          </p>
          <Schedule />
        </section>

        {/* Assignments section */}
        <section>
          <div className="flex items-center  mt-14 -mb-8 border-l-8 border-[#AB5BF7] bg-[#1A1A1A] text-white rounded w-max p-[10px] shadow-xl \">
            <Notebook />
            <h2 className="text-3xl font-bold ml-2">Assignments</h2>
          </div>
          <div className="container mx-auto py-10 rounded">
            <DataTable columns={columns} data={assignData} />
          </div>
        </section>

        {/* Teams sections */}
        {/* <section>
          <div className="flex items-center  mt-7 -mb-8 border-l-8 border-[#AB5BF7] bg-[#1A1A1A] text-white rounded w-max p-[10px] shadow-xl \">
            <Users />
            <h2 className="text-3xl font-bold ml-2">Teams</h2>
          </div>
           <div className="container mx-auto py-10 rounded">
            <DataTable columns={columns} data={assignData} />
          </div> 
        </section> */}
      </div>
    </div>
  );
}
