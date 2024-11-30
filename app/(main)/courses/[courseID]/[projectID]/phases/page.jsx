'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, UsersIcon, ClockIcon, CheckCircleIcon, CodeIcon, RocketIcon } from 'lucide-react'



export default function ProjectPhasesPage({ params }) {
    const [projectID, setProjectID] = useState(null);
    const [project, setProject] = useState({ phases: [] });
    const [progress, setProgress] = useState(0);
    const [submittedphases, setsubmittedphases] = useState([]);
    function handellersubmitted(phasenum) {
        setsubmittedphases(prev => [...prev, phasenum]);
    }
    useEffect(() => {
        params.then(((resolvedparams) => {
            setProjectID(resolvedparams.projectID);
        })).then(
            setProject(getProject(projectID)
            ))
    }, [params, projectID])
    useEffect(() => {
        const completedload = project.phases.filter(phase => submittedphases.includes(phase.phaseNumber))
            .reduce((sum, phase) => sum + phase.phaseLoad, 0)
        setProgress(completedload);
    }, [submittedphases])
    if (!projectID || !project) {
        return <div>Loading...</div>;
    } else {
        return (
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >

                    <Card className="w-full overflow-hidden shadow-2xl">
                        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className='sm:text-left text-center'>
                                    <CardTitle className="text-4xl font-bold mb-2">
                                        {project.projectName}
                                    </CardTitle>
                                    <CardDescription className="text-lg text-blue-100">
                                        {project.description}
                                    </CardDescription>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={`text-lg py-1 px-3 text-center ${progress === 100
                                        ? "bg-green-500 text-white"
                                        : "bg-white text-purple-600"
                                        }`}
                                >
                                    {progress === 100 ? <>Done</> : <>In progress</>}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                                <div className="flex flex-wrap items-center gap-4">
                                    <span className="flex items-center text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                                        <CalendarIcon className="w-4 h-4 mr-2 text-blue-500" />
                                        {project.startDate} - {project.endDate}
                                    </span>
                                    <span className="flex items-center text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                                        <UsersIcon className="w-4 h-4 mr-2 text-purple-500" />
                                        Team: {project.teamSize}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">{progress}%</div>
                                    <div className="text-sm text-gray-500">Overall Progress</div>
                                </div>
                            </div>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-8"
                            />
                            <Separator className="my-8" />
                            <h3 className='text-2xl font-semibold mb-6 text-center'>
                                Project Phases
                            </h3>
                            <div className='space-y-6'>
                                {project.phases.map((phase) => (
                                    <motion.div
                                        key={phase.phaseNumber}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="bg-white hover:shadow-lg transition-shadow duration-300">
                                            <CardContent className="p-6">
                                                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4'>
                                                    <h4 className="text-xl font-semibold flex items-center">
                                                        <CodeIcon className="w-5 h-5 mr-2 text-blue-500" />
                                                        Phase {phase.phaseNumber} : {phase.phaseName}
                                                    </h4>
                                                    <span className='text-sm text-gray-500 flex items-center'>
                                                        <ClockIcon className='w-4 h-4 mr-1 text-purple-500' />
                                                        Deadline: {phase.deadline}
                                                    </span>
                                                </div>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${phase.phaseLoad}%` }}
                                                    transition={{ duration: 0.5 }}
                                                    className="h-2 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full mb-2"
                                                />
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                    <span className="text-sm text-gray-500">
                                                        Phase Load: {phase.phaseLoad}%
                                                    </span>
                                                    <AnimatePresence>
                                                        {submittedphases.includes(phase.phaseNumber) ?
                                                            <motion.div
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="flex items-center text-green-500"
                                                            >
                                                                <CheckCircleIcon className="w-5 h-5 mr-2" />
                                                                Submitted
                                                            </motion.div>
                                                            :
                                                            <motion.div
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                            >
                                                                <Button
                                                                    onClick={() => handellersubmitted(phase.phaseNumber)}
                                                                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                                                                >
                                                                    <RocketIcon className="w-4 h-4 mr-2" />
                                                                    Submit Phase
                                                                </Button>
                                                            </motion.div>
                                                        }
                                                    </AnimatePresence>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div >
        )
    }
}





function getProject(projectID) {

    const projects = [
        {
            "projectID": "101",
            "projectName": "Website Development",
            "description": "A project to build a responsive website for a client.",
            "startDate": "2024-01-01",
            "endDate": "2024-06-30",
            "status": "In Progress",
            "teamSize": 5,
            "phases": [
                {
                    "phaseNumber": 1,
                    "phaseName": "Requirement Gathering",
                    "phaseLoad": 10,
                    "deadline": "2024-01-15"
                },
                {
                    "phaseNumber": 2,
                    "phaseName": "Design",
                    "phaseLoad": 20,
                    "deadline": "2024-02-15"
                },
                {
                    "phaseNumber": 3,
                    "phaseName": "Development",
                    "phaseLoad": 50,
                    "deadline": "2024-05-01"
                },
                {
                    "phaseNumber": 4,
                    "phaseName": "Testing and Deployment",
                    "phaseLoad": 20,
                    "deadline": "2024-06-30"
                }
            ]
        },
        {
            "projectID": "102",
            "projectName": "Mobile App Development",
            "description": "A project to create a cross-platform mobile app.",
            "startDate": "2024-02-01",
            "endDate": "2024-09-30",
            "status": "Not Started",
            "teamSize": 8,
            "phases": [
                {
                    "phaseNumber": 1,
                    "phaseName": "Planning",
                    "phaseLoad": 15,
                    "deadline": "2024-02-15"
                },
                {
                    "phaseNumber": 2,
                    "phaseName": "UI/UX Design",
                    "phaseLoad": 25,
                    "deadline": "2024-03-30"
                },
                {
                    "phaseNumber": 3,
                    "phaseName": "Development",
                    "phaseLoad": 40,
                    "deadline": "2024-08-01"
                },
                {
                    "phaseNumber": 4,
                    "phaseName": "Release",
                    "phaseLoad": 20,
                    "deadline": "2024-09-30"
                }
            ]
        }
    ]
    const project = projects.find(project => project.projectID === projectID);
    return project;
}

