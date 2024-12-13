"use client";

import { useState } from "react";
import { useAlert } from "./alert-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateAssignment } from "@/actions/update-assignment";

export default function AssignmentList({ assignments, onModify }) {
  const { showAlert } = useAlert();
  const [editingAssignment, setEditingAssignment] = useState(null);

  const handleEditClick = (assignment) => {
    setEditingAssignment({ ...assignment });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditingAssignment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const assignModify = async function () {
      try {
        const res = await updateAssignment(
          Number(editingAssignment.assignment_id),
          editingAssignment.title,
          editingAssignment.max_grade,
          editingAssignment.description,
          editingAssignment.due_date
        );
        if (res.status == 200)
          showAlert({
            message: "assignment modified successfully",
            severity: "success",
          });
      } catch (e) {
        console.log(e);
      }
    };
    assignModify().then(() => {
      onModify(
        assignments.map((a) =>
          a.assignment_id === editingAssignment.assignment_id
            ? editingAssignment
            : a
        )
      );
    });

    setEditingAssignment(null);
  };

  return (
    <div className="p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Assignments</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Max Grade</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.assignment_id}>
              <TableCell>{assignment.title}</TableCell>
              <TableCell>{assignment.due_date}</TableCell>
              <TableCell>{assignment.max_grade}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(assignment)}
                    >
                      Modify
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Modify Assignment</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-4 py-4"
                    >
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title">Name</Label>
                        <Input
                          id="title"
                          name="title"
                          value={editingAssignment?.title || ""}
                          onChange={handleChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="due_date">Deadline</Label>
                        <Input
                          id="due_date"
                          name="due_date"
                          type="date"
                          value={editingAssignment?.due_date || ""}
                          onChange={handleChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="max_grade">Max Grade</Label>
                        <Input
                          id="max_grade"
                          name="max_grade"
                          type="number"
                          value={editingAssignment?.max_grade || ""}
                          onChange={handleChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={editingAssignment?.description || ""}
                          onChange={handleChange}
                          className="col-span-3"
                        />
                      </div>
                      <Button type="submit" className="col-span-4">
                        Save Changes
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
