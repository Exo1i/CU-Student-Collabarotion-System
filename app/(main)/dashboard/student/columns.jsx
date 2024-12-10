"use client";
import { Bookmark } from "lucide-react";
export const columns = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Bookmark />
          {row.original.title}
        </div>
      );
    },
  },
  {
    accessorKey: "maxGrade",
    header: "Max Grade",
  },
  {
    accessorKey: "dueDate",
    header: "Deadline",
  },
  {
    accessorKey: "", //TODO check if it has a submission by this student
    header: "Status",
    cell: ({ row }) => {
      //row.original.  //to access any data of an assignment
      return <div />;
    },
  },
];
