'use client';
import React from 'react';
import {BookOpen, Calendar, MessageSquare, Sparkles, Users, Video} from 'lucide-react';

const ComingSoonPage = () => {


    const features = [{icon: Users, text: "Group Projects"}, {icon: MessageSquare, text: "Real-time Chat"}, {
        icon: Video, text: "Video Sessions"
    }, {icon: Calendar, text: "Study Planning"}];

    return (<div
            className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 flex flex-col items-center justify-center p-4 text-white">
            <div className="relative mb-8">
                <BookOpen className="w-24 h-24 text-blue-300 animate-bounce" />
                <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-4 -right-4 animate-pulse" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
                StudCollab
            </h1>

            <div className="flex items-center text-2xl md:text-3xl mb-10">
                <div>Coming to our college soon!</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {features.map((Feature, index) => (<div key={index}
                                                        className="flex flex-col items-center space-y-2 bg-white/10 backdrop-blur-sm rounded-lg p-4 transform transition hover:scale-105">
                    <Feature.icon className="w-8 h-8 text-blue-300" />
                    <span className="text-sm text-center">{Feature.text}</span>
                </div>))}
            </div>

            <div className="space-y-6 text-center max-w-md">
                <p className="text-lg text-blue-100">
                    The future of student collaboration is almost here. Join our waitlist to be the first to know!
                </p>

                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        <input
                            type="email"
                            placeholder="Your student email"
                            className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center md:flex-1"
                        />

                    </div>
                    <button
                        className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 hover:opacity-90 transform transition hover:scale-105 font-semibold">
                        Join the Waitlist
                    </button>
                </div>
            </div>

            <div className="mt-12 text-center text-blue-200 text-sm">
                <p>Launch planned for December 2024</p>
            </div>
        </div>
    );
};

export default ComingSoonPage;