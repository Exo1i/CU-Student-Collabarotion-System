'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, ClockIcon, CodeIcon, UsersIcon } from 'lucide-react'
import Phasesubmissionbutton from '@/app/components/phasesubmissionbuttom'
import Loading from '@/app/(main)/loading'
import { getRole } from '@/actions/GetRole'
export default function ProjectPhasesPage({ params }) {
    const [projectID, setProjectID] = useState(null);
    useEffect(() => {
        params.then(((resolvedparams) => {
            setProjectID(resolvedparams.projectID);
        }))
    }, [params, projectID])
    const [role, setrole] = useState(null);
    useEffect(() => {
        async function getcurrentuserrole() {
            try {
                const currentUserRole = await getRole();
                setrole(currentUserRole);
            } catch (err) {
                console.log(err);
            }
        }

        getcurrentuserrole()
    }, [role])
    const [project, setproject] = useState({ phases: [] });
    const [loading, setLoading] = useState(false);
    const [error, seterror] = useState(null);
    useEffect(() => {
        async function fetchprojectdata() {
            if (!projectID) return;
            console.log(projectID);
            try {
                const res = await fetch(`/api/projects/${projectID}/phases`);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                let data = await res.json();
                console.log(res);
                console.log(data);
                setproject(data)
                seterror(null);
            } catch (err) {
                console.log(err);
                seterror(err);
                setproject(null);
                // return <div>Error loading course. Please try again later.</div>;
            } finally {
                setLoading(false);
            }
        }

        fetchprojectdata();
        console.log(project)
    }, [projectID])
    const [progress, setProgress] = useState(0);
    const [submittedphases, setsubmittedphases] = useState([]);

    useEffect(() => {
        const completedload = project.phases.filter(phase => submittedphases.includes(phase.phase_num))
            .reduce((sum, phase) => sum + phase.phase_load, 0)
        setProgress(completedload);
    }, [submittedphases])

    if (loading) {
        return <Loading />
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    if (!projectID || !project) {
        return <Loading />
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
                                <div className="sm:text-left text-center">
                                    <CardTitle className="text-4xl font-bold mb-2">
                                        {project.project_name}
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
                                    <span
                                        className="flex items-center text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                                        <CalendarIcon className="w-4 h-4 mr-2 text-blue-500" />
                                        {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                                    </span>
                                    <span
                                        className="flex items-center text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                                        <UsersIcon className="w-4 h-4 mr-2 text-purple-500" />
                                        Team: {project.max_team_size}
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
                            <h3 className="text-2xl font-semibold mb-6 text-center">
                                Project Phases
                            </h3>
                            <div className="space-y-6">
                                {project.phases.map((phase) => (
                                    <motion.div
                                        key={phase.phase_num}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="bg-white hover:shadow-lg transition-shadow duration-300">
                                            <CardContent className="p-6">
                                                <div
                                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                                    <h4 className="text-xl font-semibold flex items-center">
                                                        <CodeIcon className="w-5 h-5 mr-2 text-blue-500" />
                                                        Phase {phase.phase_num} : {phase.phase_name}
                                                    </h4>
                                                    <span className="text-sm text-gray-500 flex items-center">
                                                        <ClockIcon className="w-4 h-4 mr-1 text-purple-500" />
                                                        Deadline: {new Date(phase.deadline).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${phase.phase_load}%` }}
                                                    transition={{ duration: 0.5 }}
                                                    className="h-2 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full mb-2"
                                                />
                                                <div
                                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                    <span className="text-sm text-gray-500">
                                                        Phase Load: {phase.phase_load}%
                                                    </span>
                                                    <AnimatePresence>
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                        >
                                                            {
                                                                role === 'student' &&
                                                                <Phasesubmissionbutton phase={phase}
                                                                    projectID={projectID}
                                                                    setsubmittedphases={setsubmittedphases} />
                                                            }
                                                        </motion.div>
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
            </div>
        )
    }
}






