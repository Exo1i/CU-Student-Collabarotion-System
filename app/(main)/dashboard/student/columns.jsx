"use client";
import { Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
];
