import { notFound } from "next/navigation";
import { UserGroupIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { CalendarIcon, ClockIcon } from "lucide-react";
import CustomLink from "@/app/components/MyCustomLink";
import SubmissionAssignment from "@/app/components/SubmissionAssignment";
export default async function CoursePage({ params }) {
    const { courseID } = await params;
    const course = await getCourseById(courseID);
    console.log(courseID)
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/CMP2020`)
        console.log(res);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        const Testcourse = await res.json();
        // console.log(Testcourse);
    } catch (err) {
        console.log(err);
        return <div>Error loading course. Please try again later.</div>;
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
                            src={course.courseImage}
                            alt={`${course.name} thumbnail`}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 hover:scale-105"
                        />
                    </div>

                    <div className="w-full md:w-2/3 space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight">{course.name}</h1>
                        <p className="text-xl text-indigo-100">{course.description}</p>
                        <div className="flex items-center space-x-4">
                            <Image
                                src={course.instructorImage}
                                alt={`${course.instructorName} photo`}
                                width={48}
                                height={48}
                                className="rounded-full object-cover border-2 border-indigo-300"
                            />
                            <p className="text-indigo-100">
                                Instructor: <span className="font-semibold">{course.instructorName}</span>
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
                            key={assignment.ID}
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
                                        Due: {assignment.dueDate}
                                    </span>
                                    <span className="flex items-center">
                                        <ClockIcon className="h-5 w-5 mr-2 text-indigo-500" />
                                        Max Grade: {assignment.maxGrade}
                                    </span>
                                </div>
                            </div>
                            <SubmissionAssignment assignment={assignment} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Project Section */}
            <section>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Project
                </h2>
                <div
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-indigo-300">
                    <div className="p-8 space-y-6">
                        <h3 className="text-2xl font-semibold text-gray-900">
                            {course.project.projectName}
                        </h3>
                        <p className="text-gray-600">{course.project.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                                <UserGroupIcon className="h-5 w-5 mr-2 text-indigo-500" />
                                Team Size: {course.project.teamSize}
                            </div>
                            <div className="flex items-center">
                                <CalendarIcon className="h-5 w-5 mr-2 text-indigo-500" />
                                Start: {course.project.startDate}
                            </div>
                            <div className="flex items-center">
                                <CalendarIcon className="h-5 w-5 mr-2 text-indigo-500" />
                                End: {course.project.endDate}
                            </div>
                            <div className="flex items-center">
                                <CustomLink href={`/courses/${course.id}/${course.project.projectId}`}>
                                    see project teams
                                </CustomLink>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}


function getCourseById(id) {
    const courses = [
        {
            id: '1',
            name: 'Web Development Bootcamp',
            courseImage: "/courseImg/coursetest1.jpg",
            description: 'Learn to build websites!',
            instructorName: 'John Doe',
            instructorImage: "/courseImg/instructortest1.jpg",
            assignments: [
                {
                    ID: '1',
                    title: 'HTML Basics',
                    maxGrade: 100,
                    description: 'Learn the basics of HTML by creating a simple webpage.',
                    dueDate: '2024-12-01',
                },
                {
                    ID: '2',
                    title: 'CSS Styling',
                    maxGrade: 100,
                    description: 'Style your webpage using CSS techniques.',
                    dueDate: '2024-12-08',
                },
            ],
            project: {
                teamSize: 4,
                description: 'Build a fully responsive website using HTML, CSS, and JavaScript. Includes interactive features and dynamic elements.',
                projectId: '101',
                startDate: '2024-11-01',
                endDate: '2024-12-15',
                projectName: 'Responsive Website Project',
            },
        },
        {
            id: '2',
            name: 'Data Science Mastery',
            courseImage: "/courseImg/coursetest2.jpg",
            description: 'Master data science concepts!',
            instructorName: 'Jane Smith',
            instructorImage: "/courseImg/instructortest1.jpg",
            assignments: [
                {
                    ID: '3',
                    title: 'Data Analysis Basics',
                    maxGrade: 100,
                    description: 'Analyze a dataset using basic statistics.',
                    dueDate: '2024-12-05',
                },
                {
                    ID: '4',
                    title: 'Visualization with Python',
                    maxGrade: 100,
                    description: 'Create visualizations using Python libraries like Matplotlib and Seaborn.',
                    dueDate: '2024-12-12',
                },
            ],
            project: {
                teamSize: 5,
                description: 'Conduct an in-depth analysis of a real-world dataset. Use Python for data preprocessing, analysis, and visualization.',
                projectId: '102',
                startDate: '2024-10-15',
                endDate: '2024-12-20',
                projectName: 'Data Science Capstone',
            },
        },
    ];

    return courses.find(course => course.id === id);
}

