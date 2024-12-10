"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CurrentProject({ project, onModify }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editedProject, setEditedProject] = useState(project);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onModify(editedProject);
    setIsOpen(false);
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="border-l-8 border-[#AB5BF7] bg-[#1A1A1A] rounded-md text-white text-white">
        <CardTitle>Current Project</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col gap-y-3">
        <p>
          <strong>Name:</strong> {project.name}
        </p>
        <p>
          <strong>Description:</strong> {project.description}
        </p>
        <p>
          <strong>Team Size:</strong> {project.teamSize}
        </p>
        <p>
          <strong>Grade:</strong> {project.grade}
        </p>
        <p>
          <strong>Due Date:</strong> {project.dueDate}
        </p>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white">
              Modify Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modify Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={editedProject.name}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={editedProject.description}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="teamSize">Team Size</Label>
                <Input
                  id="teamSize"
                  name="teamSize"
                  type="number"
                  value={editedProject.teamSize}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  name="grade"
                  type="number"
                  value={editedProject.grade}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={editedProject.dueDate}
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
      </CardContent>
    </Card>
  );
}
