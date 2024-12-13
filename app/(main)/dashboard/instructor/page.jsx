"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import Course from "@/components/Course";
import CreateProject from "@/components/CreateProjectCard";
import EnrolledStudents from "@/components/Enrolledstudents";
import StudentSubmissions from "@/components/Submission";
import CurrentProject from "@/components/CurrentProject";
import CreateAssignment from "@/components/CreateAssignment";
import AssignmentList from "@/components/AssignmentList";
import { addAssignmentGrade } from "@/actions/update-assignmentgrade";
import { useAlert } from "@/components/alert-context";
export default function Page({ params }) {
  // const {??} = params; TODO
  // const { instructorId } = await auth();
  // console.log(instructorId);
  const { showAlert } = useAlert();

  const [course, setcourse] = useState({
    id: 1,
    name: "Introduction to Computer Science",
    maxGrade: 100,
    courseImage: "/courseImg/coursetest1.jpg",
  });

  const [currentProject, setCurrentProject] = useState({
    name: "Final Project",
    description: "Build a full-stack web application",
    teamSize: 3,
    grade: 100,
    dueDate: "2023-12-31",
  });

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      name: "Assignment 1",
      deadline: "2023-07-15",
      maxGrade: 100,
      description: "Complete exercises 1-5",
    },
    {
      id: 2,
      name: "Assignment 2",
      deadline: "2023-07-30",
      maxGrade: 100,
      description: "Build a simple calculator",
    },
  ]);

  const handleCreateProject = (project) => {
    console.log("New project created:", project);
    setCurrentProject(project);
  };

  const handleCreateAssignment = (assignment) => {
    setAssignments([
      ...assignments,
      { id: assignments.length + 1, ...assignment },
    ]);
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome, Instructor
      </motion.h1>
      <div className="grid gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Course</h2>
          <div className="grid grid-cols-3 gap-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-2"
            >
              <Course course={course} />
            </motion.div>

            {/* Actions Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="mb-4  rounded-md ">
                  <CardTitle>What would you like to do today?</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                  <EnrolledStudents />
                  <CreateProject onCreateProject={handleCreateProject} />
                  <CreateAssignment
                    onCreateAssignment={handleCreateAssignment}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CurrentProject
            project={currentProject}
            onModify={setCurrentProject}
          />
        </motion.div>
        <div className="grid grid-cols-2 gap-2">
          <AssignmentList assignments={assignments} onModify={setAssignments} />
          <StudentSubmissions />
        </div>
      </div>
    </div>
  );
}
if (window) window.addAssignmentGrade = addAssignmentGrade;
