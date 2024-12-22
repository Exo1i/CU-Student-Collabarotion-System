"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Course from "@/components/Course";
import CreateProject from "@/components/CreateProjectCard";
import EnrolledStudents from "@/components/Enrolledstudents";
import StudentSubmissions from "@/components/Submission";
import CurrentProject from "@/components/CurrentProject";
import CreateAssignment from "@/components/CreateAssignment";
import AssignmentList from "@/components/AssignmentList";
import {useAlert} from "@/components/alert-context";
import Loading from "@/app/(main)/loading";
import {useAuth} from "@clerk/nextjs";
import ProjectPhases from "@/app/(main)/dashboard/instructor/ProjectPhases";

export default function InstructorPage() {
    const [refreshKey, setRefreshKey] = useState(0);
    const {showAlert} = useAlert();
    const [currentProject, setCurrentProject] = useState({});
    const [assignments, setAssignments] = useState([]);
    const [instructorData, setInstructorData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [courseCode, setCourseCode] = useState("");
    const {userId, isSignedIn, isLoaded} = useAuth();

    const handleRefresh = () => {
        console.log("Refreshing data...");
        setRefreshKey(prev => prev + 1);
    };

    useEffect(() => {
        async function fetchCourseData() {
            if (!isLoaded || !isSignedIn || !userId) return;

            try {
                const res = await fetch(`/api/instructor/${userId}`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
                }

                const data = await res.json();
                setInstructorData(data);
                setCourseCode(data.course.course_code);
                setAssignments(data.course.assignments.map(assignment => ({
                    ...assignment,
                    course_code: data.course.course_code
                })));
                setCurrentProject(data.course.project || {});
                setError(null);
            } catch (err) {
                setError(err);
                showAlert({
                    message: err.message,
                    severity: "error"
                });
            } finally {
                setLoading(false);
            }
        }

        fetchCourseData();
    }, [userId, refreshKey, isLoaded, isSignedIn]);

    const handleCreateProject = (project) => {
        setCurrentProject(project);
        handleRefresh();
    };

    const handleCreateAssignment = (assignment) => {
        setAssignments(prev => [...prev, {id: prev.length + 1, ...assignment}]);
        handleRefresh();
    };

    const handleProjectUpdate = (updatedProject) => {
        setCurrentProject(updatedProject);
        handleRefresh();
    };

    if (loading) return <Loading />;
    if (error) return (
        <div className="flex items-center justify-center h-screen">
            <Card className="w-96 text-center">
                <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Dashboard</h2>
                    <p className="text-gray-600">{error.message}</p>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <motion.h1
                className="text-4xl font-bold mb-8 text-center"
                initial={{opacity: 0, y: -50}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                Welcome, {instructorData.instructor?.full_name}
            </motion.h1>

            <div className="grid gap-8">
                {/* Course Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Your Course</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.div
                            initial={{opacity: 0, x: -50}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.5, delay: 0.2}}
                            className="md:col-span-2"
                        >
                            <Course courseData={instructorData.course} />
                        </motion.div>

                        {/* Actions Section */}
                        <motion.div
                            initial={{opacity: 0, x: 50}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.5, delay: 0.4}}
                        >
                            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <EnrolledStudents />
                                    {!currentProject?.project_id && (
                                        <CreateProject
                                            onCreateProject={handleCreateProject}
                                            courseCode={courseCode}
                                        />
                                    )}
                                    <CreateAssignment
                                        onCreateAssignment={handleCreateAssignment}
                                        courseCode={courseCode}
                                        onrefresh={handleRefresh}
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>

                {/* Project Section */}
                <motion.div
                    initial={{opacity: 0, y: 50}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.2}}
                    className="space-y-6"
                >
                    {currentProject?.project_id && (
                        <>
                            <CurrentProject
                                project={currentProject}
                                onModify={handleProjectUpdate}
                            />
                            <ProjectPhases
                                projectId={currentProject.project_id}
                                projectMaxGrade={currentProject.max_grade}
                                phases={currentProject.phases || []}
                                onRefresh={handleRefresh}
                            />
                        </>
                    )}
                </motion.div>

                {/* Assignments and Submissions Section */}
                <motion.div
                    initial={{opacity: 0, y: 50}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.4}}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <AssignmentList
                        assignments={assignments}
                        onModify={setAssignments}
                    />
                    <StudentSubmissions
                        submissions={instructorData.course?.assignments}
                        project={instructorData.course?.project}
                    />
                </motion.div>
            </div>
        </div>
    );
}