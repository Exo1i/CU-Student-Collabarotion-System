'use client';

import React, {useEffect, useState} from 'react';
import {ArrowRight, BookOpen, GraduationCap, Loader2, Sparkles, Users} from 'lucide-react';
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {useRouter} from "next/navigation";
import {addCourse} from "@/actions/add-course";
import {useAlert} from "@/components/alert-context";
import {useAuth} from "@clerk/nextjs";
import {Progress} from "@/components/ui/progress";
import {updateMetadata} from "@/actions/metadata-actions";

export default function OnboardingPage() {
    const [userType, setUserType] = useState(null);
    const [courseData, setCourseData] = useState({
        course_code: '',
        course_name: '',
        max_grade: '',
        course_img: '',
        description: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const router = useRouter();
    const {showAlert} = useAlert();
    const {userId} = useAuth();

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) return 100;
                    return prev + 5;
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isLoading]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setCourseData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setProgress(0);

        try {
            if (userType === 'instructor') {
                const result = await addCourse(
                    courseData.course_code,
                    courseData.course_name,
                    userId,
                    parseInt(courseData.max_grade),
                    courseData.course_img,
                    courseData.description
                );

                if (result.status === 200) {
                    showAlert({message: result.message, severity: 'success'});
                    await updateMetadata({role: 'instructor', hasOnBoarded: true});
                } else {
                    showAlert({message: result.message, severity: 'error'});
                    setIsLoading(false);
                    return;
                }
            } else {
                await updateMetadata({role: 'student', hasOnBoarded: true});
            }

            const redirectInterval = setInterval(() => {
                router.push('/dashboard');
            }, 500);

            setTimeout(() => {
                clearInterval(redirectInterval);
                if (isLoading) {
                    setIsLoading(false);
                    showAlert({
                        message: 'Taking longer than expected. Please refresh the page.',
                        severity: 'warning'
                    });
                }
            }, 10000);

        } catch (error) {
            showAlert({message: 'An error occurred during onboarding', severity: 'error'});
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center w-full max-w-md px-4">
                    <Loader2 className="w-16 h-16 animate-spin text-purple-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Setting up your account...</h2>
                    <Progress value={progress} className="mb-2 h-2" />
                    <p className="text-sm text-foreground/60">
                        {progress < 30 && "Updating your profile..."}
                        {progress >= 30 && progress < 60 && "Almost there..."}
                        {progress >= 60 && progress < 90 && "Preparing your dashboard..."}
                        {progress >= 90 && "Redirecting you..."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16 flex flex-col items-center">
                <div className="relative mb-8">
                    <div className="bg-gradient-to-br from-purple-400 via-violet-500 to-purple-600 rounded-full p-4">
                        <BookOpen className="w-16 h-16 text-white animate-bounce" />
                        <Sparkles className="w-6 h-6 text-purple-200 absolute -top-2 -right-2 animate-pulse" />
                    </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-400 bg-clip-text text-transparent">
                    Welcome to Mitra
                </h1>

                <p className="text-xl md:text-2xl text-center mb-8 text-foreground/80 max-w-2xl">
                    Let&#39;s get you started on your collaborative learning journey
                </p>

                {!userType ? (
                    <div className="flex flex-col items-center gap-6 mb-16">
                        <h2 className="text-2xl font-semibold text-foreground">Are you a student or an instructor?</h2>
                        <div className="flex gap-4">
                            <Button
                                size="lg"
                                className="text-lg bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                                onClick={() => setUserType('student')}
                            >
                                I&#39;m a Student
                                <Users className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                size="lg"
                                className="text-lg bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                                onClick={() => setUserType('instructor')}
                            >
                                I&#39;m an Instructor
                                <GraduationCap className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Card className="w-full max-w-2xl">
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-semibold mb-6 text-center">
                                {userType === 'student' ? 'Student Onboarding' : 'Create Your Course'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {userType === 'instructor' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="course_code">Course Code</Label>
                                            <Input
                                                id="course_code"
                                                name="course_code"
                                                value={courseData.course_code}
                                                onChange={handleInputChange}
                                                required
                                                className="border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="course_name">Course Name</Label>
                                            <Input
                                                id="course_name"
                                                name="course_name"
                                                value={courseData.course_name}
                                                onChange={handleInputChange}
                                                required
                                                className="border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="max_grade">Maximum Grade</Label>
                                            <Input
                                                id="max_grade"
                                                name="max_grade"
                                                type="number"
                                                value={courseData.max_grade}
                                                onChange={handleInputChange}
                                                required
                                                className="border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="course_img">Course Image URL</Label>
                                            <Input
                                                id="course_img"
                                                name="course_img"
                                                type="url"
                                                value={courseData.course_img}
                                                onChange={handleInputChange}
                                                className="border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description">Course Description</Label>
                                            <Textarea
                                                id="description"
                                                name="description"
                                                value={courseData.description}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className="border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                                            />
                                        </div>
                                    </>
                                )}
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full text-lg bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                                >
                                    {userType === 'instructor' ? 'Create Course' : 'Continue as Student'}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

