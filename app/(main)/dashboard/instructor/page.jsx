"use client";

import { useState } from "react";
import { useEffect } from "react";
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
import { addAssignment } from "@/actions/add-assignment";
import { useAlert } from "@/components/alert-context";

export default function Page({ params }) {
  // const {??} = params; TODO
  // const { instructorId } = await auth();
  // console.log(instructorId);
  const { showAlert } = useAlert();

  const [currentProject, setCurrentProject] = useState({
    name: "Final Project",
    description: "Build a full-stack web application",
    teamSize: 3,
    grade: 100,
    dueDate: "2023-12-31",
  });
  const [assignments, setAssignments] = useState([]);
  const [instructorData, setInstructorData] = useState({});
  const [error, seterror] = useState(null);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    async function fetchCourseData() {
      try {
        let res = await fetch("http://localhost:3000/api/instructor/user005");
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        let data = await res.json();
        setInstructorData(data);
        setAssignments(data.course.assignments);
        setCurrentProject(data.course.project);
        seterror(null);
      } catch (error) {
        seterror(error);
        console.log(error);
      } finally {
        setloading(false);
      }
    }
    fetchCourseData();
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;

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
        Welcome, {instructorData.instructor.full_name}
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
              <Course courseData={instructorData.course} />
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
          <StudentSubmissions submissions={instructorData.course.assignments} />
        </div>
      </div>
    </div>
  );
}
// if (window) {
//   window.addAssignmentGrade = addAssignmentGrade;
//   window.addAssignment = addAssignment;
// }
