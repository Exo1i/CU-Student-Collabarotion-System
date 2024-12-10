import Link from "next/link"
import {cn} from "@/lib/utils"
import useChatStore from "@/hooks/useChatStore"
import {useAlert} from "@/components/alert-context"
import {ChevronRight, Plus, Search} from 'lucide-react'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {useMemo, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";


export const ChannelsList = ({channels}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const {selectedChannel, setSelectedChannel} = useChatStore()
    const {showAlert} = useAlert()

    const handleCreateChannel = () => {

    }
    const handleChannelSelect = (channel) => {
        if (selectedChannel?.channel_num !== channel.channel_num)
            setSelectedChannel(channel)
        // showAlert({
        //     message: `Switched to channel: ${channel.channel_name}`,
        //     severity: "info",
        // })
    }

    // Memoized filtered channels
    const filteredChannels = useMemo(() => {
        if (!searchTerm) return channels;

        const searchTermLower = searchTerm.toLowerCase();
        return channels.filter(channel =>
            channel.channel_name.toLowerCase().includes(searchTermLower) ||
            (channel.channel_description &&
                channel.channel_description.toLowerCase().includes(searchTermLower))
        );
    }, [channels, searchTerm]);


    return (
        <>
            <div className="p-4 border-b">
                <div className="flex items-center mb-4 space-x-2">
                    <div className="relative flex-grow">
                        <Search
                            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <Input
                            placeholder="Search Channels"
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCreateChannel}
                                >
                                    <Plus size={20} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Create New Channel</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            <nav aria-label="Channels navigation">
                <ul className="space-y-1">
                    {filteredChannels?.map((channel) => (
                        <li key={channel.channel_num}>
                            <Link
                                href={``}
                                onClick={() => handleChannelSelect(channel)}
                                className={cn(
                                    "flex items-center px-3 py-2 rounded-md transition-colors ",
                                    selectedChannel?.channel_num === channel.channel_num
                                        ? " text-accent-foreground font-medium bg-indigo-700"
                                        : "text-muted-foreground"
                                )}
                            >
                                <ChevronRight strokeWidth={5} className="mr-2 h-4 w-4"
                                              color={selectedChannel?.channel_num === channel.channel_num ? 'black' : 'grey'} />
                                <div
                                    className={selectedChannel?.channel_num === channel.channel_num ? 'font-bold text-gray-300' : ''}>{channel.channel_name}</div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </>)
}

export default ChannelsList

