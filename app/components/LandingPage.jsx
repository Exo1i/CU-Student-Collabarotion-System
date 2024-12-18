'use client';

import React from 'react';
import {ArrowRight, BookOpen, Calendar, Check, MessageSquare, Sparkles, Users} from 'lucide-react';
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {useAuth} from "@clerk/nextjs";
import {useRouter} from "next/navigation";

const features = [{
    icon: Users, text: "Group Projects", description: "Find perfect project partners and collaborate seamlessly"
}, {
    icon: MessageSquare,
    text: "Real-time Chat",
    description: "Stay connected with instant messaging and group discussions"
}, {
    icon: Calendar, text: "Study Planning", description: "Organize your schedule and track project deadlines"
}];

const benefits = ["Join study groups across different courses", "Share resources and materials instantly", "Get help from top-performing peers", "Track your academic progress"];

export default function LandingPage() {
    const {isSignedIn} = useAuth();
    const router = useRouter();

    return (<div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center">
            <div className="relative mb-8">
                <div className="bg-gradient-to-br from-purple-400 via-violet-500 to-purple-600 rounded-full p-4">
                    <BookOpen className="w-16 h-16 text-white animate-bounce" />
                    <Sparkles className="w-6 h-6 text-purple-200 absolute -top-2 -right-2 animate-pulse" />
                </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-400 bg-clip-text text-transparent">
                StudCollab
            </h1>

            <p className="text-xl md:text-2xl text-center mb-8 text-foreground/80 max-w-2xl">
                Transform your academic journey with collaborative learning and project management
            </p>

            <div className="flex gap-4 mb-16">
                {isSignedIn ? (<Button
                    size="lg"
                    className="text-lg bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                    onClick={() => router.push('/dashboard')}
                >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>) : (<>
                    <Button
                        size="lg"
                        className="text-lg bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                        onClick={() => router.push('/signup')}
                    >
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="text-lg border-purple-500 text-purple-500 hover:bg-purple-50"
                        onClick={() => router.push('/signin')}
                    >
                        Sign In
                    </Button>
                </>)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 w-full">
                {features.map((feature, index) => (<Card key={index} className="transform transition hover:scale-105">
                    <CardContent className="flex flex-col items-center space-y-4 p-6">
                        <div className="p-3 rounded-full bg-purple-100">
                            <feature.icon className="w-8 h-8 text-purple-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{feature.text}</h3>
                        <p className="text-sm text-center text-foreground/70">{feature.description}</p>
                    </CardContent>
                </Card>))}
            </div>

            <div className="bg-card rounded-lg p-8 w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-6 text-center">Why Choose StudCollab?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (<div key={index} className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <Check className="h-5 w-5 text-purple-500" />
                        </div>
                        <span className="text-foreground/80">{benefit}</span>
                    </div>))}
                </div>
            </div>
        </div>
    </div>);
}