import React from "react";
import { Ellipsis } from "lucide-react";

export default function UserCard(props) {
  return (
    <div className="rounded-2xl gap-4 odd:bg-violet-200 even:bg-emerald-300 p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/2025
        </span>
        <Ellipsis width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">400</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">
        {props.type}
      </h2>
    </div>
  );
}
