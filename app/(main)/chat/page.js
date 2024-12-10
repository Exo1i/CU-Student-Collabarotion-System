'use client'
import {useEffect, useMemo, useState} from "react";
import {Loader2, Plus, Search, Settings} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import useSWR from "swr";
import useChatStore from "@/hooks/useChatStore";
import Chat from "@/app/(main)/chat/chat";
import ChannelsList from "@/app/(main)/chat/ChannelsList";
import {useAlert} from "@/components/alert-context";

// Centralized fetcher function
const fetcher = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    return response.json();
};

export default function ChatPage() {
    const {
        selectedGroupID,
        setSelectedGroupID,
        selectedChannel,
        setSelectedChannel
    } = useChatStore();

    const {showAlert} = useAlert();
    const [channels, setChannels] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch channels using SWR with error handling
    const {
        data,
        isLoading,
        error
    } = useSWR(
        selectedGroupID && selectedGroupID !== 'undefined'
            ? `/api/chat/${selectedGroupID}`
            : null,
        fetcher
    );

    // Handle data loading and error states
    useEffect(() => {
        if (!isLoading && data) {
            setChannels(data.channels || []);
        }

        if (error) {
            showAlert({
                message: 'Error loading channels. Please try again.',
                severity: 'error',
                position: 'bottom-right',
            });
            console.error('Error fetching data:', error);
        }
    }, [data, error, showAlert]);

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

    // Handle channel creation (placeholder)
    const handleCreateChannel = () => {
        showAlert({
            message: 'Channel creation is not implemented yet',
            severity: 'info'
        });
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar Channels Section */}
            <div className="w-[15%] flex-shrink-0 flex flex-col border-r border-gray-200">
                {/* Search and Actions */}
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

                {/* Channels List */}
                <div className="flex-grow overflow-y-auto p-2">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="animate-spin text-gray-400" size={32} />
                        </div>
                    ) : (
                        <ChannelsList channels={filteredChannels} />
                    )}
                </div>

                {/* Bottom Actions */}
                <div className="border-t p-4 flex justify-between items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Settings size={20} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Group Settings</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* Main Chat Section */}
            <div className="flex-grow overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="animate-spin text-gray-400" size={32} />
                    </div>
                ) : (
                    <Chat
                        channelName={selectedChannel?.channel_name || 'Select a channel'}
                    />
                )}
            </div>
        </div>
    );
}