'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from 'framer-motion'

const courses = [
    {
        id: 1,
        courseName: "Web Development Bootcamp",
        courseImage: "/courseImg/coursetest1.jpg",
        instructorName: "John Doe",
        instructorImage: "/courseImg/instructortest1.jpg",
        category: "Web Development",
    },
    {
        id: 2,
        courseName: "Data Science Mastery",
        courseImage: "/courseImg/coursetest2.jpg",
        instructorName: "Jane Smith",
        instructorImage: "/courseImg/instructortest1.jpg",
        category: "Data Science",
    },
    {
        id: 3,
        courseName: "Machine Learning Advanced",
        courseImage: "/courseImg/coursetest1.jpg",
        instructorName: "Alice Brown",
        instructorImage: "/courseImg/instructortest1.jpg",
        category: "Machine Learning",
    },
]

const categories = ["All", "Web Development", "Data Science", "Machine Learning"]

export default function CoursesPage() {


    const [filter, setFilter] = useState("All")
    const [Testcourses , setcourses] = useState(null);
    const [error, seterror] = useState(null);
    const [loading, setloading] = useState(true);
    const filterdCourses = filter === "All" ? courses : courses.filter(course => course.category === filter);
    useEffect(() => {
        async function fetchCourseData() {
            try {
                let res = await fetch("/api/courses");
                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
                }
                let Testcourses = await res.json();
                setcourses(Testcourses);
                seterror(null);
            } catch (error) {
                seterror(error);
                setcourses(null)
            } finally {
                setloading(false);
            }
        }
        fetchCourseData();
        console.log(Testcourses)
    }, [])
    if (loading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error: {error}</div>; 
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

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                {filterdCourses.map((course) => (
                    <motion.div
                        key={course.id}
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
                                    src={course.courseImage}
                                    alt={course.courseName}
                                    width={400}
                                    height={225}
                                    className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0  transition-opacity duration-300" />
                            </CardHeader>

                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                    {course.courseName}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Instructor:</p>
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={course.instructorImage}
                                        alt={course.instructorName}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500 transition-transform group-hover:scale-110"
                                    />
                                    <span
                                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                        {course.instructorName}
                                    </span>
                                </div>
                            </CardContent>

                            <CardFooter className="p-6 pt-0">
                                <Button asChild
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105">
                                    <Link href={`/courses/${course.id}`}>
                                        View Course
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}

