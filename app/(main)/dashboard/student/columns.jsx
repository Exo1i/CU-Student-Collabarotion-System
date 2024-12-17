"use client";
import { Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const columns = [
  {
    accessorKey: "name",
    header: "Title",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Bookmark />
          {row.original.name}
        </div>
      );
    },
  },
  ,
  {
    accessorKey: "course_name",
    header: "Course",
  },
  {
    accessorKey: "max_grade",
    header: "Max Grade",
  },
  {
    accessorKey: "due_date",
    header: "Deadline",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const isSuccess = row.original.status === "done";
      return (
        <Badge
          variant={status.toLowerCase() === "done" ? "outline" : "destructive"}
          className={`capitalize ${
            isSuccess ? "bg-green-100 text-green-800" : ""
          }`}
        >
          {status.toUpperCase()}
        </Badge>
      );
    },
  },
  // {
  //   accessorKey: "grade",
  //   header: "Grade",
  // },
  ,
];
