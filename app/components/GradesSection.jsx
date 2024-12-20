'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Loading from '../(main)/loading'
export default function GradesSection({ userId }) {
    const [grades, setGrades] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await fetch('/api/students/${userId}/grades')
                if (!response.ok) {
                    throw new Error(`Failed to fetch grades: ${response.statusText}`)
                }
                const data = await response.json()
                setGrades(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred while fetching grades')
            } finally {
                setIsLoading(false)
            }
        }

        fetchGrades()
    }, [userId])

    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 mr-2 text-purple-500"
                >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                Your Grades
            </h2>
            {grades.map((course) => (
                <Card key={course.course_code} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle>{course.course_name} ({course.course_code})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Assignments</h3>
                                {course.assignmentsGrades.assignments.length > 0 ? (
                                    course.assignmentsGrades.assignments.map((assignment) => (
                                        <div key={assignment.assignment_id} className="mb-2">
                                            <div className="flex justify-between text-sm">
                                                <span>{assignment.title}</span>
                                                <span>{assignment.grade}/{assignment.max_grade}</span>
                                            </div>
                                            <Progress value={(assignment.grade / assignment.max_grade) * 100} className="h-2" />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No assignments graded yet.</p>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Project</h3>
                                {course.projectGrades.phases.length > 0 ? (
                                    course.projectGrades.phases.map((phase) => (
                                        <div key={phase.phase_num} className="mb-2">
                                            <div className="flex justify-between text-sm">
                                                <span>{phase.title}</span>
                                                <span>{phase.grade}/{course.projectGrades.max_grade}</span>
                                            </div>
                                            <Progress value={(phase.grade / course.projectGrades.max_grade) * 100} className="h-2" />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No project phases graded yet.</p>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold">Total Grade</h3>
                                <div className="flex justify-between items-center">
                                    <Progress value={(course.total_grade / (course.projectGrades.max_grade + (course.assignmentsGrades.assignments.reduce((sum, a) => sum + a.max_grade, 0)))) * 100} className="h-4 flex-grow mr-4" />
                                    <span className="font-bold">{course.total_grade}/{course.projectGrades.max_grade + (course.assignmentsGrades.assignments.reduce((sum, a) => sum + a.max_grade, 0))}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

