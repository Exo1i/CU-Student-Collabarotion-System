'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AwardIcon, CodeIcon, CrownIcon, UserIcon } from 'lucide-react'
import { notFound } from 'next/navigation'
import ProfileReview from '@/app/components/ProfileReview'
import Loading from "@/app/(main)/loading";
import BadgeSection from "@/app/components/Badges";
import GradesSection from '@/app/components/GradesSection'

const ProfileHeader = ({ imageUrl, fullName }) => (
    <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        <div className="absolute inset-0 bg-black opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white tracking-wider">Profile</h1>
        </div>
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="rounded-full border-4 border-white shadow-lg overflow-hidden">
                <Image
                    src={imageUrl || '/courseImg/student.jpg'}
                    alt={fullName}
                    width={128}
                    height={128}
                    className="rounded-full transition-transform duration-300 hover:scale-110"
                    priority
                />
            </div>
        </div>
    </div>
)

const TeamCard = ({ team }) => (
    <div
        className={`p-4 rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl ${team.leader ? 'bg-gradient-to-br from-yellow-100 to-yellow-200' : 'bg-gradient-to-br from-gray-100 to-gray-200'
            }`}
    >
        <div className="flex justify-between">
            <h2>{team.team_name}</h2>
            {team.leader && <CrownIcon className="w-6 h-6 text-yellow-500 animate-pulse" />}
        </div>
        <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${team.leader ? 'bg-yellow-300 text-yellow-800' : 'bg-gray-300 text-gray-800'
                }`}
        >
            {team.leader ? "leader" : "member"}
        </span>
    </div>
)

const useUserData = (userId) => {
    const [userData, setUserData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `/api/students/${userId}/profile/`
                )

                if (!response.ok) {
                    throw new Error(`Failed to fetch profile: ${response.statusText}`)
                }

                const data = await response.json()
                console.log(data)
                setUserData(data)
            } catch (err) {
                setError(err.message)
                console.error('Error fetching user data:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [userId])

    return { userData, error, loading, setUserData }
}

export default function Profile({ userID, role, myprofile }) {
    const { userData, error, loading, setUserData } = useUserData(userID)

    const handleBadgeChange = (newBadges) => {
        setUserData((prevData) => ({
            ...prevData,
            badges: newBadges
        }))
    }

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>
    }

    if (!userData) {
        return notFound()
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 relative">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-100 to-purple-100 opacity-50 blur-3xl" />

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <ProfileHeader imageUrl={userData.img_url} fullName={userData.full_name} />

                <div className="relative pt-16 pb-8 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center text-gray-500 mt-3">
                            <UserIcon className="w-6 h-6 mr-2" />
                            <h2 className="text-gray-900 font-bold text-3xl">
                                {userData.full_name}
                            </h2>
                        </div>
                    </div>

                    <BadgeSection
                        badges={userData.badges}
                        userId={userID}
                        role={role}
                        onBadgeChange={handleBadgeChange}
                    />
                </div>
            </div>
            {
                role === 'student' && <>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center">
                            <CodeIcon className="mr-2" />
                            <h1 className="font-bold text-2xl">Current Teams</h1>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {userData.teams.map((team, index) => (
                                <TeamCard key={index} team={team} />
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                            <AwardIcon className="w-6 h-6 mr-2 text-purple-500" />
                            Reviews
                        </h2>
                        <div className="space-y-4">
                            {userData.reviews.map((review, index) => (
                                <ProfileReview
                                    key={index}
                                    review={review}
                                    reviewee_ID={userID}
                                    role={role}
                                />
                            ))}
                        </div>
                    </div>
                </>
            }
            {
                role === 'student' && myprofile && <GradesSection userId={userID} />
            }
        </div>
    )
}