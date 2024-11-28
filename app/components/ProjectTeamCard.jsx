'use client'

import {useState} from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {CheckCircle, ChevronDown, ChevronUp, Crown, Send, XCircle} from 'lucide-react'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Progress} from "@/components/ui/progress"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import CustomLink from './MyCustomLink'

export default function ProjectTeamCard({Team}) {
    const [joinReq, setjoinReq] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card className="w-full max-w-2xl mx-auto overflow-hidden transition-all duration-300 hover:shadow-xl relative">
            <div
                className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
                #{Team.teamNumber}
            </div>
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle className="text-2xl text-center font-bold">
                    {Team.name}
                </CardTitle>
                <CardDescription className="text-purple-100 text-center">
                    {Team.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 lg-w-full">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    {Team.available ? (!joinReq ? (<Button
                        onClick={() => setjoinReq(true)}
                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center space-x-2"
                    >
                        <CheckCircle className="w-5 h-5" />
                        <span>Request to Join</span>
                    </Button>) : (<Button
                        disabled
                        className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md flex items-center space-x-2"
                    >
                        <Send className="w-5 h-5" />
                        <span>Request Sent</span>
                    </Button>)) : (<Button
                        disabled
                        className="bg-red-500 text-white font-medium py-2 px-4 rounded-md opacity-75 flex items-center space-x-2 cursor-not-allowed"
                    >
                        <XCircle className="w-5 h-5" />
                        <span>Team is Full</span>
                    </Button>)}

                    <div className="w-full sm:w-2/3 flex items-center space-x-4">
                        <div className="w-full relative pt-1">
                            <Progress
                                value={Team.progress}
                                className="h-2"
                            />
                            <div className="flex items-center justify-center mt-2">
                                <div
                                    className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                                    {Team.progress}% Complete
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center flex-wrap gap-2 pt-6 mb-4">
                    {Team.technologies.map((tech) => (<Badge key={tech} variant="secondary">{tech}</Badge>))}
                </div>
                <div className="flex flex-wrap justify-center gap-4 mb-4">
                    {Team.members.map((member) => (<TooltipProvider key={member.name}>
                        <Tooltip>
                            <TooltipTrigger>
                                <motion.div
                                    whileHover={{scale: 1.1}}
                                    whileTap={{scale: 0.9}}
                                    className="relative"
                                >
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={member.avatar} alt={member.name} />
                                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    {member.role === 'leader' && (
                                        <Crown className="absolute -top-2 -right-2 w-5 h-5 text-yellow-500" />)}
                                </motion.div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{member.name}</p>
                                <p className="text-sm text-gray-500">{member.role}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>))}
                </div>
                <Button
                    onClick={() => setIsExpanded(!isExpanded)}
                    variant="outline"
                    className="w-full"
                >
                    {isExpanded ? (<>
                        <ChevronUp className="mr-2 h-4 w-4" />
                        Hide Team Details
                    </>) : (<>
                        <ChevronDown className="mr-2 h-4 w-4" />
                        Show Team Details
                    </>)}
                </Button>
            </CardContent>
            <AnimatePresence>
                {isExpanded && (<motion.div
                    initial={{opacity: 0, height: 0}}
                    animate={{opacity: 1, height: 'auto'}}
                    exit={{opacity: 0, height: 0}}
                    transition={{duration: 0.3}}
                >
                    <CardFooter className="flex flex-col gap-4 p-6 bg-gray-50">
                        {Team.members.map((member) => (
                            <div key={member.name} className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={member.photo} alt={member.name} />
                                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{member.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {member.role === 'leader' ? (<span className="flex items-center">
                                                        <Crown className="w-4 h-4 text-yellow-500 mr-1" />
                                                        Team Leader
                                                    </span>) : member.role}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <CustomLink href="/">
                                            Show Profile
                                        </CustomLink>
                                    </Button>
                                </div>
                            </div>))}
                    </CardFooter>
                </motion.div>)}
            </AnimatePresence>
        </Card>)
}

