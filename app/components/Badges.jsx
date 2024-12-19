'use client'
import GiveBadgeDialog from "@/app/components/GiveBadgeDialog";
import {Button} from "@/components/ui/button";
import {PlusCircleIcon} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import Image from "next/image";
import DeleteBadgeButton from "@/app/components/DeleteBadgeButtom";

const BadgeSection = ({badges, userId, role, onBadgeChange}) => {
    const handleBadgeDeleted = (badgeId) => {
        console.log(badgeId)
        onBadgeChange(badges.filter(badge => badge.badge_id !== badgeId))
    }

    const handleBadgeAdded = (newBadge) => {
        onBadgeChange([...badges, newBadge])
    }

    return (<div className="text-center mt-4">
        <div className="flex items-center justify-center">
            {badges.length > 0 && (
                <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text tracking-wide mr-2">
                    Student Badges
                </h2>)}
            {role === 'admin' && (<GiveBadgeDialog userId={userId} onBadgeAdded={handleBadgeAdded}>
                <Button variant="outline" size="icon">
                    <PlusCircleIcon className="h-4 w-4" />
                    <span className="sr-only">Give Badge</span>
                </Button>
            </GiveBadgeDialog>)}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
            {badges.map((badge) => (<BadgeItem
                key={badge.badge_id}
                badge={badge}
                userId={userId}
                role={role}
                onBadgeDeleted={handleBadgeDeleted}
            />))}
        </div>
    </div>)
}

const BadgeItem = ({badge, userId, role, onBadgeDeleted}) => (<TooltipProvider>
    <Tooltip>
        <TooltipTrigger asChild>
            <div
                className="relative p-3 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md hover:shadow-lg rounded-full transition-transform duration-300 hover:scale-110">
                <Image
                    src={badge?.picture}
                    alt={badge.title}
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                {role === 'admin' && (<DeleteBadgeButton
                    userId={userId}
                    badgeId={badge.badge_id}
                    onBadgeDeleted={() => {
                        onBadgeDeleted(badge.badge_id)

                    }}
                />)}
            </div>
        </TooltipTrigger>
        <TooltipContent>
            <p>{badge.title}</p>
        </TooltipContent>
    </Tooltip>
</TooltipProvider>)

export default BadgeSection;