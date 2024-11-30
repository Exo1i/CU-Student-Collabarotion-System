import React from "react";
import UserCard from "@/components/UserCard";
import { columns } from "@/app/(main)/dashboard/admin/columns";
import { DataTable } from "@/app/(main)/dashboard/admin/data-table";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

async function getData() {
  //TODO: Fetch data of all users from API here.
  return [
    {
      id: "728ed52f",
      name: "John Doe",
      course: "Web development",
      email: "doe@example.com",
      avatarURL: "https://github.com/shadcn.png",
      role: "teacher",
    },
    {
      id: "728ed3352a",
      name: "Ali",
      course: "Data Structure",
      email: "ali@example.com",
      role: "student",
    },
  ];
}

export default async function AdminPage() {
  const data = await getData();

  return (
    <div className="p-4 flex gap-4 flex-col">
      <div className="w-full md:flex-row">
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="admin" />
          <UserCard type="teacher" />
          <UserCard type="student" />
          <UserCard type="course" />
        </div>
      </div>
      <div className="grid w-full gap-2">
        <Label htmlFor="message-2" className="text-2xl mt-3">
          Announcment
        </Label>
        <Textarea placeholder="Type your message here." />
        <p className="text-sm text-muted-foreground">
          Your message will be displayed to all users.
        </p>
        <Button>Send message</Button>
      </div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
