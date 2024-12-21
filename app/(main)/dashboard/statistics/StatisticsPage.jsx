'use client';

import React, { useEffect, useState } from 'react';
import { Award, BarChart, GraduationCap, Medal, ShieldCheck, Star, TrendingUp, Trophy, MessageSquare } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useRouter } from "next/navigation";

const StatisticsPage = () => {
    const [generalStats, setGeneralStats] = useState(null);
    const [courseStats, setCourseStats] = useState(null);
    const [performanceStats, setPerformanceStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [generalResponse, courseResponse, performanceResponse] = await Promise.all([fetch('/api/stats/general'), fetch('/api/stats/courses'), fetch('/api/stats/performance')]);

                const generalData = await generalResponse.json();
                const courseData = await courseResponse.json();
                const performanceData = await performanceResponse.json();

                setGeneralStats(generalData);
                setCourseStats({
                    courseStatistics: courseData.courseStatistics.map(course => ({
                        ...course, average_grade: parseFloat(course.average_grade).toFixed(3),
                    }))
                });
                setPerformanceStats(performanceData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (<div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>);
    }

    const userStats = [{
        icon: GraduationCap,
        title: "Students",
        value: generalStats?.users.totalStudents.toLocaleString(),
        description: "Enrolled students"
    }, {
        icon: Award,
        title: "Instructors",
        value: generalStats?.users.totalInstructors.toLocaleString(),
        description: "Teaching staff"
    }, {
        icon: ShieldCheck,
        title: "Administrators",
        value: generalStats?.users.totalAdmins.toLocaleString(),
        description: "Platform administrators"
    }];

    return (<div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
            {/* Header and Admin Button - Same as before */}
            <div className="flex flex-col items-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-400 bg-clip-text text-transparent">
                    Platform Statistics
                </h1>

                <p className="text-xl text-center mb-8 text-foreground/80 max-w-2xl">
                    Comprehensive analytics and insights about our educational community
                </p>

                <Button
                    size="lg"
                    className="text-lg bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                    onClick={() => router.push('/admin')}
                >
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    Go to Admin Dashboard
                </Button>
            </div>

            {/* Top Performers Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Top Performing Students</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="transform transition hover:scale-105">
                        <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                                <Trophy className="w-6 h-6 text-purple-500 mr-2" />
                                <h3 className="text-lg font-semibold">Highest Overall Grade</h3>
                            </div>
                            {performanceStats?.topPerformingStudents.overall.map((student, index) => (
                                <div key={index} className="mb-2">
                                    <p className="font-semibold">{student.name}</p>
                                    <p className="text-foreground/70">Total Grade: {student.total_grade}</p>
                                    <p className="text-sm text-foreground/60">Courses: {student.courses_count}</p>
                                </div>))}
                        </CardContent>
                    </Card>

                    <Card className="transform transition hover:scale-105">
                        <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                                <Star className="w-6 h-6 text-purple-500 mr-2" />
                                <h3 className="text-lg font-semibold">Highest Rated Student</h3>
                            </div>
                            {performanceStats?.topRatedStudents.overall.map((student, index) => (
                                <div key={index} className="mb-2">
                                    <p className="font-semibold">{student.name}</p>
                                    <p className="text-foreground/70">Average
                                        Rating: {parseFloat(student.average_rating).toFixed(2)}/5</p>
                                    <p className="text-sm text-foreground/60">Projects
                                        Reviewed: {student.projects_reviewed}</p>
                                </div>))}
                        </CardContent>
                    </Card>

                    <Card className="transform transition hover:scale-105">
                        <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                                <MessageSquare className="w-6 h-6 text-purple-500 mr-2" />
                                <h3 className="text-lg font-semibold">Most Talkative Student</h3>
                            </div>
                            {performanceStats?.topchatterbox.overall && (
                                <div className="mb-2">
                                    <p className="font-semibold">{performanceStats.topchatterbox.overall.username}</p>
                                    <p className="text-foreground/70">Messages Sent: {performanceStats.topchatterbox.overall.message_count}</p>
                                    <p className="text-sm text-foreground/60">Fun Fact: This student&apos;s keyboard is on fire!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Course-Specific Performance */}
            <Card className="mb-12">
                <CardContent className="p-6">
                    <div className="flex items-center mb-6">
                        <Medal className="w-6 h-6 text-purple-500 mr-2" />
                        <h2 className="text-2xl font-bold">Top Performance by Course</h2>
                    </div>
                    <div className="grid gap-6">
                        {performanceStats?.topPerformingStudents.byCourse.map((course, index) => (
                            <div key={index} className="bg-purple-50 rounded-lg p-4">
                                <h3 className="font-semibold text-lg mb-2">{course.course_name} ({course.course_code})</h3>
                                {course.top_students.map((student, sIndex) => (<div key={sIndex} className="ml-4">
                                    <p className="font-medium">{student.name}</p>
                                    <div className="text-sm text-foreground/70">
                                        <p>Assignment Grades: {student.assignment_grades}</p>
                                        <p>Project Grades: {student.phase_grades}</p>
                                        <p>Total Grade: {student.total_grade}</p>
                                    </div>
                                </div>))}
                            </div>))}
                    </div>
                </CardContent>
            </Card>

            {/* User Statistics Cards - Same as before */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {userStats.map((stat, index) => (<Card key={index} className="transform transition hover:scale-105">
                    <CardContent className="flex flex-col items-center space-y-4 p-6">
                        <div className="p-3 rounded-full bg-purple-100">
                            <stat.icon className="w-8 h-8 text-purple-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{stat.title}</h3>
                        <p className="text-3xl font-bold text-purple-600">{stat.value}</p>
                        <p className="text-sm text-center text-foreground/70">{stat.description}</p>
                    </CardContent>
                </Card>))}
            </div>

            {/* Course Statistics - Same as before */}
            <Card className="mb-12">
                <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Course Performance Overview</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={courseStats?.courseStatistics}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="course_code" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="average_grade" stroke="#8b5cf6"
                                    name="Average Grade" />
                                <Line type="monotone" dataKey="max_grade" stroke="#22c55e" name="Maximum Grade" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Course Type Distribution - Same as before */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Course Distribution</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                            <BarChart className="w-8 h-8 text-purple-500" />
                            <div>
                                <p className="text-lg font-semibold">Project-Based Courses</p>
                                <p className="text-3xl font-bold text-purple-600">
                                    {generalStats?.courses.projectBasedCourses}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                            <TrendingUp className="w-8 h-8 text-purple-500" />
                            <div>
                                <p className="text-lg font-semibold">Theory-Only Courses</p>
                                <p className="text-3xl font-bold text-purple-600">
                                    {generalStats?.courses.theoryOnlyCourses}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>);
};

export default StatisticsPage;

