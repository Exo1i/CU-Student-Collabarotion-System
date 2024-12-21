"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "./ui/label";
import { useAlert } from "./alert-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import addProject from "@/actions/add-project";

export default function CreateProject({ onCreateProject, courseCode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { showAlert } = useAlert();
  const [project, setProject] = useState({
    name: "",
    courseCode: courseCode,
    description: "",
    teamSize: 1,
    grade: 0,
    dueDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(project);
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (project.name != "") {
      showAlert({
        message: "There exists a project for current course",
        severity: "error",
      });
      return;
    }
    const createProject = async function () {
      try {
        const res = await addProject(
          project.name,
          project.courseCode,
          project.dueDate,
          project.description,
          project.teamSize,
          project.grade
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
    createProject().then(() => {
      onCreateProject({
        project_id: null,
        project_name: project.name,
        max_grade: project.grade,
        description: project.description,
        end_date: project.dueDate,
        max_team_size: project.teamSize,
      });

      setProject({
        name: "",
        courseCode: courseCode,
        description: "",
        teamSize: 1,
        grade: 0,
        dueDate: "",
      });
      setIsOpen(false);
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
            Create Project
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
            <div className="grid w-full items-center gap-4">
              <Input
                id="name"
                name="name"
                placeholder="Project Name"
                value={project.name}
                onChange={handleChange}
                required
              />
              <Textarea
                id="description"
                name="description"
                placeholder="Project Description"
                value={project.description}
                onChange={handleChange}
                required
              />
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  name="courseCode"
                  value={project.courseCode}
                  onChange={handleChange}
                  disabled
                  required
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="teamSize">Team size</Label>
                <Input
                  id="teamSize"
                  name="teamSize"
                  type="number"
                  placeholder="Team Size"
                  value={project.teamSize}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="projGrade">Project Grade</Label>
                <Input
                  id="grade"
                  name="grade"
                  type="number"
                  placeholder="Grade"
                  value={project.grade}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="deadLine">Deadline</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={project.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="col-span-4">
              Create Project
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
