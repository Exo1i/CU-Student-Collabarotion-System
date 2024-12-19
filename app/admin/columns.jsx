"use client";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export const columns = [
  {
    accessorKey: "avatar",
    header: "User",
    cell: ({ row }) => {
      const avatarUrl = row.original.avatarUrl;
      const fallback = row.original.name.charAt(0); //TODO: append initial of last name
      return (
        <Avatar>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "id",
    header: "User ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];
