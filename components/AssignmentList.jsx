"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

export default function AssignmentList({ assignments, onModify }) {
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
    onModify(
      assignments.map((a) =>
        a.id === editingAssignment.id ? editingAssignment : a
      )
    );
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
            <TableRow key={assignment.id}>
              <TableCell>{assignment.name}</TableCell>
              <TableCell>{assignment.deadline}</TableCell>
              <TableCell>{assignment.maxGrade}</TableCell>
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
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={editingAssignment?.name || ""}
                          onChange={handleChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="deadline">Deadline</Label>
                        <Input
                          id="deadline"
                          name="deadline"
                          type="date"
                          value={editingAssignment?.deadline || ""}
                          onChange={handleChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="maxGrade">Max Grade</Label>
                        <Input
                          id="maxGrade"
                          name="maxGrade"
                          type="number"
                          value={editingAssignment?.maxGrade || ""}
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
