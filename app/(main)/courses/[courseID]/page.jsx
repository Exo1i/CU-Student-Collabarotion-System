'use client'
import { notFound, usePathname } from "next/navigation";
import { UserGroupIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { CalendarIcon, ClockIcon } from "lucide-react";
import CustomLink from "@/app/components/MyCustomLink";
import SubmissionAssignment from "@/app/components/SubmissionAssignment";
import { useEffect, useState } from "react";
import Loading from "@/app/(main)/loading";
import { useUser } from '@clerk/nextjs';
export default function CoursePage() {
    const [refreshKey, setRefreshKey] = useState(0);
    const handleRefresh = () => {
        console.log("handleRefresh");
        setRefreshKey((prev) => prev + 1);
    };
    const { user, isLoaded, isSignedIn } = useUser();
    const pathname = usePathname();
    console.log("path : " + pathname);
    const [courseCode, setCourseCode] = useState(null);
    const [course, setcourse] = useState(null);
    const [error, seterror] = useState(null);
    const [loading, setloading] = useState(true);
    useEffect(() => {
        const pathParts = pathname.split('/');
        const code = pathParts[pathParts.length - 1];
        setCourseCode(code);

        async function fetchCourseData() {
            try {
                console.log(`Fetching course data for courseCode: ${courseCode}`);
                let res = await fetch(`/api/courses/${courseCode}?stud=${user.id}`);
                console.log(res);
                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
                }
                let fetchedcourse = await res.json();
                setcourse(fetchedcourse);
                seterror(null);
            } catch (error) {
                seterror(error);
                console.log(error);
                setcourse(null)
            } finally {
                setloading(false);
            }
        }

        if (courseCode && isLoaded && isSignedIn) {
            fetchCourseData()
        }
    }, [courseCode, isLoaded, isSignedIn, refreshKey])
    if (loading || !isLoaded || !isSignedIn) {
        return <Loading />
    }
    if (error) {
        {
            console.error(error);
        }
        return <div>Error...</div>;
    }
    if (!course) {
        return notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12 space-y-12">
            {/* Course Header */}
            <div
                className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl rounded-3xl p-8 transition-all duration-300 hover:shadow-indigo-500/50">
                <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                    {/* Course Image */}
                    <div className="w-full md:w-1/3 aspect-video relative overflow-hidden rounded-2xl shadow-lg">
                        <Image
                            src={course.course_img || '/courseImg/coursetest1.jpg'}
                            alt={`${course.course_name} thumbnail`}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 hover:scale-105"
                        />
                    </div>

                    <div className="w-full md:w-2/3 space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight">{course.course_name}</h1>
                        <p className="text-xl text-indigo-100">{course.course_description}</p>
                        <div className="flex items-center space-x-4">
                            <Image
                                src={course.img_url || '/courseImg/instructortest1.jpg'}
                                alt={`${course.full_name} photo`}
                                width={48}
                                height={48}
                                className="rounded-full object-cover border-2 border-indigo-300"
                            />
                            <p className="text-indigo-100">
                                Instructor: <span className="font-semibold">{`${course.full_name}`}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <section>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Assignments
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {course.assignments.map((assignment) => (
                        <div
                            key={assignment.assignment_id}
                            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-indigo-300"
                        >
                            <div className="p-6 space-y-4">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {assignment.title}
                                </h3>
                                <p className="text-gray-600">{assignment.description}</p>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <CalendarIcon className="h-5 w-5 mr-2 text-indigo-500" />
                                        Due: {new Date(new Date(assignment.due_date).toLocaleDateString()).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center">
                                        <ClockIcon className="h-5 w-5 mr-2 text-indigo-500" />
                                        Max Grade: {assignment.max_grade}
                                    </span>
                                </div>
                            </div>
                            <SubmissionAssignment assignment={assignment} onRefresh={handleRefresh} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Project Section */}
            {
                course?.category === "project_based" && <section>
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Project
                    </h2>
                    <div
                        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-indigo-300">
                        <div className="p-8 space-y-6">
                            <h3 className="text-2xl font-semibold text-gray-900">
                                {course.project.project_name}
                            </h3>
                            <p className="text-gray-600">{course.project.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <UserGroupIcon className="h-5 w-5 mr-2 text-indigo-500" />
                                    Team Size: {course.project.max_team_size}
                                </div>
                                <div className="flex items-center">
                                    <CalendarIcon className="h-5 w-5 mr-2 text-indigo-500" />
                                    Start: {new Date(course.project.start_date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                    <CalendarIcon className="h-5 w-5 mr-2 text-indigo-500" />
                                    End: {new Date(course.project.end_date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                    <CustomLink href={`/courses/${course.course_code}/${course.project.project_id}`}>
                                        see project teams
                                    </CustomLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            }
        </div>
    );
}



