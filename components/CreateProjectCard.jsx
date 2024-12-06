"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import addProject from "@/actions/add-project";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, MessageCircleXIcon } from "lucide-react";
export default function CreateProject(onCreateProject) {
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [project, setProject] = useState({
    name: "",
    courseCode: "",
    description: "",
    teamSize: 1,
    grade: 0,
    dueDate: "",
  });

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000); // Notification will disappear after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setNotification({
        type: "success",
        title: "Project created successfully",
        message: `Project "${project.name}" has been added to the course.`,
      });

      const result = await addProject(
        project.name,
        project.courseCode,
        project.dueDate,
        project.description,
        project.teamSize,
        project.grade
      );
    } catch (e) {
      setNotification({
        type: "error",
        title: "Error creating team",
        message: "There was a problem creating the team. Please try again.",
      });
    }
    // Reset form after submission
    setProject({
      name: "",
      courseCode: "",
      description: "",
      teamSize: 1,
      grade: 0,
      dueDate: "",
    });
    setIsOpen(false);
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
      {notification && (
        <Alert
          variant={notification.type === "success" ? "default" : "destructive"}
          className={`z-[9999] fixed bottom-4 right-4 w-96 animate-in fade-in slide-in-from-bottom-5 ${
            notification.type === "success"
              ? "bg-green-100 border-green-500 text-green-800"
              : "bg-red-100 border-red-500 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <MessageCircleXIcon className="h-4 w-4" />
          )}
          <AlertTitle>{notification.title}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
