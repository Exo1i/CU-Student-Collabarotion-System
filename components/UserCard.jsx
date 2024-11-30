import React from "react";
import { Baby, User2, GraduationCap, BookOpen } from "lucide-react";

export default function UserCard(props) {
  const userType_icon = {
    student: <Baby className="size-12 w-full" />,
    teacher: <GraduationCap className="size-12 w-full" />,
    admin: <User2 className="size-12 w-full" />,
    course: <BookOpen className="size-12 w-full" />,
  };
  const icon = userType_icon[props.type];
  return (
    <div className="rounded-2xl gap-4 odd:bg-red-200 even:bg-emerald-300 p-4 text-center shadow-lg shadow-slate-200 flex-col justify-center flex-1 min-w-[90px] duration-300 ease-in-out transform hover:scale-105">
      <div className="">{icon}</div>

      <h1 className="text-xl font-semibold my-4">400</h1>
      <h2 className="capitalize text-lg font-medium text-gray-500">
        {props.type}
      </h2>
    </div>
  );
}
