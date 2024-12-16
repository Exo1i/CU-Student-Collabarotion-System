"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAlert } from "./alert-context";
import { addAssignment } from "@/actions/add-assignment";

export default function CreateAssignment({ onCreateAssignment, courseCode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { showAlert } = useAlert();
  const [assignment, setAssignment] = useState({
    name: "",
    deadline: "",
    maxGrade: "",
    description: "",
    course_code: courseCode,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const createAssign = async function () {
      try {
        const res = await addAssignment(
          assignment.name,
          assignment.maxGrade,
          assignment.description,
          assignment.deadline,
          assignment.course_code
        );
        if (res.status == 200)
          showAlert({
            message: res.message,
            severity: "success",
          });
      } catch (e) {
        showAlert({
          message: e.message,
          severity: "error",
        });
      }
    };
    createAssign().then(() => {
      onCreateAssignment(assignment);
      setAssignment({
        name: "",
        deadline: "",
        maxGrade: "",
        description: "",
        course_code: courseCode,
      });
      setIsOpen(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
          Create Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={assignment.name}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              value={assignment.deadline}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxGrade">Max Grade</Label>
            <Input
              id="maxGrade"
              name="maxGrade"
              type="number"
              value={assignment.maxGrade}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={assignment.description}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <Button type="submit" className="col-span-4">
            Create Assignment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
