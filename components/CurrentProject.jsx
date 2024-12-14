"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAlert } from "./alert-context";
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
import { updateProject } from "@/actions/update-project";

export default function CurrentProject({ project, onModify }) {
  const [isOpen, setIsOpen] = useState(false);
  const { showAlert } = useAlert();
  const [editedProject, setEditedProject] = useState(project);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const projModify = async function () {
      try {
        const res = await updateProject(
          Number(editedProject.project_id),
          editedProject.project_name,
          editedProject.max_grade,
          editedProject.description,
          editedProject.end_date,
          editedProject.max_team_size
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
    projModify().then(() => {
      onModify(editedProject);
      setIsOpen(false);
    });
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="border-l-8 border-[#AB5BF7] bg-[#1A1A1A] rounded-md text-white text-white">
        <CardTitle>Current Project</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col gap-y-3">
        <p>
          <strong>Name:</strong> {project.project_name}
        </p>
        <p>
          <strong>Description:</strong> {project.description}
        </p>
        <p>
          <strong>Team Size:</strong> {project.max_team_size}
        </p>
        <p>
          <strong>Grade:</strong> {project.max_grade}
        </p>
        <p>
          <strong>Due Date:</strong> {project.end_date}
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
                <Label htmlFor="project_name">Name</Label>
                <Input
                  id="project_name"
                  name="project_name"
                  value={editedProject.project_name}
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
                <Label htmlFor="max_team_size">Team Size</Label>
                <Input
                  id="max_team_size"
                  name="max_team_size"
                  type="number"
                  value={editedProject.max_team_size}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="max_grade">Grade</Label>
                <Input
                  id="max_grade"
                  name="max_grade"
                  type="number"
                  value={editedProject.max_grade}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end_date">Due Date</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={editedProject.end_date}
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
