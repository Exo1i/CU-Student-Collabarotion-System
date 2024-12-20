"use client";
import {Bookmark} from "lucide-react";
import {Badge} from "@/components/ui/badge";

export const columns = [
    {
        accessorKey: "name",
        header: "Title",
        cell: ({row}) => {
            return (
                <div className="flex gap-2 items-center">
                    <Bookmark className="w-4 h-4" />
                    <span className="font-medium">{row.original.name}</span>
                </div>
            );
        },
    },
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
        cell: ({row}) => {
            const status = row.getValue("status");

            const statusStyles = {
                "missed": "bg-red-100 text-red-800 hover:bg-red-200",
                "in progress": "bg-blue-100 text-blue-800 hover:bg-blue-200",
                "done": "bg-green-100 text-green-800 hover:bg-green-200",
                "default": "bg-gray-100 text-gray-800 hover:bg-gray-200"
            };

            const statusStyle = statusStyles[status.toLowerCase()] || statusStyles.default;

            return (
                <Badge
                    variant="outline"
                    className={`capitalize ${statusStyle} border-none font-medium`}
                >
                    {status.toLowerCase() === "in progress" ? "IN PROGRESS" : status.toUpperCase()}
                </Badge>
            );
        },
    },
];