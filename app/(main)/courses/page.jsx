'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from 'framer-motion'

import Loading from "@/app/(main)/loading"

const categories = ["All", "project_based", "theory_only"]

export default function CoursesPage() {
    const [filter, setFilter] = useState("All")
    const [courses, setCourses] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCourseData() {
            try {
                let res = await fetch(`/api/courses`)
                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
                }
                let fetchedCourses = await res.json()
                setCourses(fetchedCourses)
                setError(null)
            } catch (error) {
                setError(error.message)
                console.error(error)
                setCourses([])
            } finally {
                setLoading(false)
            }
        }

        fetchCourseData()
    }, [])

    const filteredCourses = filter === "All" ? courses : courses.filter(course => course.category === filter)

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <motion.h1
                className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Discover Our Courses
            </motion.h1>

            <motion.div
                className="flex justify-center space-x-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {categories.map((category) => (
                    <Button
                        key={category}
                        onClick={() => setFilter(category)}
                        variant={filter === category ? "default" : "outline"}
                        className="transition-all duration-300 ease-in-out"
                    >
                        {category}
                    </Button>
                ))}
            </motion.div>

            {filteredCourses.length === 0 ? (
                <motion.div
                    className="text-center text-gray-500 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    No courses available for the selected category.
                </motion.div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    {filteredCourses.map((course) => (
                        <motion.div
                            key={course.course_code}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card
                                className="group overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2">
                                <CardHeader className="p-0 relative">
                                    <Image
                                        src={course.course_img || '/courseImg/coursetest1.jpg'}
                                        alt={course.course_name}
                                        width={400}
                                        height={225}
                                        className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0  transition-opacity duration-300" />
                                </CardHeader>

                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                        {course.course_name}
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Instructor:</p>
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src={course.img_url || '/courseImg/instructortest1.jpg'}
                                            alt={course.full_name}
                                            width={40}
                                            height={40}
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500 transition-transform group-hover:scale-110"
                                        />
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                            {course.full_name}
                                        </span>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-6 pt-0">
                                    <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105">
                                        <Link href={`/courses/${course.course_code}`}>
                                            View Course
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    )
}

