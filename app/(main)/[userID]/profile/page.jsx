import Image from 'next/image'
import { CrownIcon, AwardIcon, CodeIcon, UserIcon, PlusCircleIcon, Trash2Icon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { notFound } from 'next/navigation'
import { getRole } from '@/actions/GetRole'
import ProfileReview from '@/app/components/ProfileReview'
import GiveBadgeDialog from '@/app/components/GiveBadgeDialog'
import DeleteBadgeButton from '@/app/components/DeleteBadgeButtom'
import { Button } from '@/components/ui/button'

export default async function Profile({ params }) {
    const { userID } = params;
    let userData = null
    let error = null;
    const role = await getRole();
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/api/students/${userID}/profile`);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        userData = await response.json();
    } catch (err) {
        error = err.message;
        console.log(error);
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error.message}</div>;
    }
    if (!userData) {
        return notFound();
    }
    return (
        <div className="max-w-4xl mx-auto space-y-8 relative">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-100 to-purple-100 opacity-50 blur-3xl"></div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-4xl font-bold text-white tracking-wider">Profile</h1>
                    </div>
                </div>
                <div className="relative pt-16 pb-8 px-4 sm:px-6 lg:px-8">
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                        <div className="rounded-full border-4 border-white shadow-lg overflow-hidden">
                            <Image
                                src={userData.img_url}
                                alt={userData.full_name}
                                width={128}
                                height={128}
                                className="rounded-full transition-transform duration-300 hover:scale-110"
                            />
                        </div>
                    </div>
                    <div className='text-center'>
                        <div className='flex items-center justify-center text-gray-500 mt-3'>
                            <UserIcon className='w-6 h-6 mr-2' />
                            <h2 className='text-gray-900 font-bold text-3xl'>
                                {userData.full_name}
                            </h2>
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <div className="flex items-center justify-center">
                            <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text tracking-wide mr-2">
                                {userData.badges.length === 0 ? null : <>Student Badges</>}
                            </h2>
                            {role === 'admin' && (
                                <GiveBadgeDialog userId={userID}>
                                    <Button variant="outline" size="icon">
                                        <PlusCircleIcon className="h-4 w-4" />
                                        <span className="sr-only">Give Badge</span>
                                    </Button>
                                </GiveBadgeDialog>
                            )}
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {userData.badges.map((badge) => (
                                <TooltipProvider key={badge.badge_id}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="relative p-3 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md hover:shadow-lg rounded-full transition-transform transform hover:scale-110">
                                                <Image
                                                    src="/courseImg/badge.jpg"
                                                    alt={badge.title}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full"
                                                />
                                                {role === 'admin' && (
                                                    <DeleteBadgeButton
                                                        key={badge.badge_id}
                                                        userId={userID}
                                                        badgeId={badge.badge_id}
                                                    />
                                                )}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{badge.title}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
                <div className='flex items-center '>
                    <CodeIcon className='mr-2' />
                    <h1 className='font-bold text-2xl'>Current Teams</h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userData.teams.map((Team) => (
                        <div key={Team.team_num} className={`p-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl ${Team.leader ? 'bg-gradient-to-br from-yellow-100 to-yellow-200' : 'bg-gradient-to-br from-gray-100 to-gray-200'
                            }`}>
                            <div className='flex justify-between'>
                                <h2>
                                    {Team.team_name}
                                </h2>
                                {Team.leader ? <CrownIcon className='w-6 h-6 text-yellow-500 animate-pulse' /> : null}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${Team.leader ? 'bg-yellow-300 text-yellow-800' : 'bg-gray-300 text-gray-800'}`}>
                                {Team.leader ? "leader" : "member"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
                <h2 className='text-2xl font-bold mb-4 text-gray-800 flex items-center'>
                    <AwardIcon className="w-6 h-6 mr-2 text-purple-500" />
                    Reviews
                </h2>
                <div className='space-y-4'>
                    {userData.reviews.map((review, index) => (
                        <ProfileReview review={review} reviewee_ID={userID} key={index} role={role} />
                    ))}
                </div>
            </div>
        </div>
    )
}

