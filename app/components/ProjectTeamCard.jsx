'use client'

import {useEffect, useState} from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {CheckCircle, ChevronDown, ChevronUp, Crown, Star, Trash2, UserCheck, XCircle} from 'lucide-react'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Progress} from "@/components/ui/progress"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import CustomLink from './MyCustomLink'
import {usePathname, useRouter} from 'next/navigation'
import {Participation} from '@/actions/Participation'
import {DeleteMember} from '@/actions/DeleteMember'
import ReviewDialog from './review-dialog'
import {getRole} from "@/actions/GetRole";

export default function ProjectTeamCard({ userid, Team, projectID, currentuserdata , onRefresh }) {
    const [role, setrole] = useState(null);
    useEffect(() => {
        async function getcurrentuserrole() {
            try {
                const currentUserRole = await getRole();
                setrole(currentUserRole);
            } catch (err) {
                console.log(err);
            }
        }
        getcurrentuserrole()
    }, [role])
    const currentRoute = usePathname();
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    console.log(currentuserdata + Team);
    const handleJoin = async () => {
        let leader = false;
        if(Team.teamMembers.length === 0) {
            leader = true;
        }
        const res = await Participation(userid, projectID, Team.team_num, leader);
        console.log(res);
        router.refresh();
        onRefresh();
    };

    const handleDeleteMember = async (memberUserId) => {
        try {
            const res = await DeleteMember(memberUserId, projectID, currentuserdata?.team_num);
            if (res.status === 200) {
                router.refresh();
                onRefresh();
            }
        } catch (error) {
            console.log(error);
        }
        console.log(`Deleting member with userId: ${memberUserId}`);
    };

    const handleReview = (member) => {
        setSelectedMember(member);
        setIsReviewDialogOpen(true);
    };

    const isUserInAnyTeam = currentuserdata !== null;
    const isUserInThisTeam = currentuserdata?.team_num === Team.team_num;
    console.log(isUserInAnyTeam)
    const isUserLeader = currentuserdata?.leader === true;

    return (
        <Card className="w-full max-w-2xl mx-auto overflow-hidden transition-all duration-300 hover:shadow-xl relative">
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
                #{Team.team_num}
            </div>
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle className="text-2xl text-center font-bold">
                    {Team.team_name}
                </CardTitle>
                {isUserInThisTeam && isUserLeader && (
                    <div className="text-center">
                        <CustomLink className="text-center" href={`${currentRoute}/phases`}>
                            View phases
                        </CustomLink>
                    </div>
                )}
            </CardHeader>
            <CardContent className="p-6 lg-w-full">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                    {
                        role !== "student" ? null
                            : isUserInThisTeam ? (
                                <Button
                                    disabled
                                    className="bg-green-500 text-white font-medium py-2 px-4 rounded-md opacity-75 flex items-center space-x-2 cursor-not-allowed"
                                >
                                    <UserCheck className="w-5 h-5" />
                                    <span>Your Team</span>
                                </Button>
                            ) : isUserInAnyTeam ? (
                                <Button
                                    disabled
                                    className="bg-gray-500 text-white font-medium py-2 px-4 rounded-md opacity-75 flex items-center space-x-2 cursor-not-allowed"
                                >
                                    <XCircle className="w-5 h-5" />
                                    <span>Already in a Team</span>
                                </Button>
                            ) : Team.availableSlots > 0 ? (
                                <Button
                                    onClick={handleJoin}
                                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center space-x-2"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    <span>Join</span>
                                </Button>
                            ) : (
                                <Button
                                    disabled
                                    className="bg-red-500 text-white font-medium py-2 px-4 rounded-md opacity-75 flex items-center space-x-2 cursor-not-allowed"
                                >
                                    <XCircle className="w-5 h-5" />
                                    <span>Team is Full</span>
                                </Button>
                            )}

                    <div className="w-full sm:w-2/3 flex  items-center space-x-4">
                        <div className="w-full relative pt-1">
                            <Progress
                                value={Team.progress}
                                className="h-2"
                            />
                            <div className="flex items-center justify-center mt-2">
                                <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                                    {Team.progress}% Complete
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center flex-wrap gap-2 pt-6 mb-4">
                    {Team.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                </div>
                <div className="flex flex-wrap justify-center gap-4 mb-4">
                    {Team.teamMembers.map((member) => (
                        <TooltipProvider key={member.full_name}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="relative"
                                    >
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={member.avatar} alt={member.name} />
                                            <AvatarFallback>{member.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        {member.leader && (
                                            <Crown className="absolute -top-2 -right-2 w-5 h-5 text-yellow-500" />
                                        )}
                                    </motion.div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{member.full_name}</p>
                                    <p className="text-sm text-gray-500">{member.leader ? "leader" : "member"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
                <Button
                    onClick={() => setIsExpanded(!isExpanded)}
                    variant="outline"
                    className="w-full"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="mr-2 h-4 w-4" />
                            Hide Team Details
                        </>
                    ) : (
                        <>
                            <ChevronDown className="mr-2 h-4 w-4" />
                            Show Team Details
                        </>
                    )}
                </Button>
            </CardContent>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <CardFooter className="flex flex-col gap-4 p-6 bg-gray-50">
                            {Team.teamMembers.map((member) => (
                                <div key={member.full_name} className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={member.img} alt={member.full_name} />
                                            <AvatarFallback>{member.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{member.full_name}</p>
                                            <p className="text-sm text-gray-500">
                                                {member.leader ? (
                                                    <span className="flex items-center">
                                                        <Crown className="w-4 h-4 text-yellow-500 mr-1" />
                                                        Team Leader
                                                    </span>
                                                ) : "Member"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {isUserLeader && isUserInThisTeam && userid !== member.user_id && (
                                            <>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleDeleteMember(member.user_id)}
                                                    aria-label={`Delete ${member.full_name}`}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </>
                                        )}
                                        {isUserInThisTeam && userid !== member.user_id && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleReview(member)}
                                                aria-label={`Review ${member.full_name}`}
                                            >
                                                <Star className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" asChild>
                                            <CustomLink href={`/profile/${member.user_id}`}>
                                                Show Profile
                                            </CustomLink>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardFooter>
                    </motion.div>
                )}
            </AnimatePresence>
            <ReviewDialog
                isOpen={isReviewDialogOpen}
                onClose={() => setIsReviewDialogOpen(false)}
                member={selectedMember}
                projectID={projectID}
            />
        </Card>
    )
}

