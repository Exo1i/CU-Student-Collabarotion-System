'use client'
import {useEffect, useState} from "react";
import {Loader2} from 'lucide-react';
import useSWR from "swr";
import useChatStore from "@/hooks/useChatStore";
import Chat from "./Chat";
import {ChannelsList} from "@/app/(main)/chat/ChannelsList";
import {useAlert} from "@/components/alert-context";
import {getRole} from "@/lib/role";

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
        selectedGroupID, setSelectedGroupID, selectedChannel, setSelectedChannel
    } = useChatStore();

    const {showAlert} = useAlert();
    const [channels, setChannels] = useState([]);
    const [userRole, setUserRole] = useState('student')
    const [disableInput, setDisableInput] = useState(true)

    const {
        data, isLoading, error, mutate
    } = useSWR(selectedGroupID && selectedGroupID !== 'undefined' ? `/api/chat/${selectedGroupID}` : null, fetcher);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const role = await getRole()
                setUserRole(role)
            } catch (err) {
                console.error('Failed to fetch user role:', err)
            }
        }
        fetchUserRole();
    }, []);

    // Handle data loading and error states
    useEffect(() => {
        if (!isLoading && data) {
            setChannels(data.channels || []);
        }

        if (error) {
            setSelectedGroupID(null);
            setSelectedChannel(null);
            setTimeout(() => {
                showAlert({
                    message: 'Error loading channels. Please try again.', severity: 'error', position: 'bottom-right',
                });
                console.error('Error fetching data:', error);
            }, 500)
        }
    }, [data, error]);


    useEffect(() => {
        if (selectedChannel) setDisableInput(channels.filter(channel => channel.channel_num === selectedChannel.channel_num)[0]?.channel_type !== 'open' && userRole === 'student')
    }, [selectedChannel, channels])
    return (<div className="flex h-screen overflow-hidden">
        {/* Sidebar Channels Section */}
        <div className="w-[15%] flex-shrink-0 flex flex-col border-r border-gray-200">
            {/* Channels List */}
            <div className="flex-grow overflow-y-auto p-2">
                {isLoading ? (<div className="flex justify-center items-center h-full">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>) : (<ChannelsList
                    channels={channels}
                    setChannels={setChannels}
                    userRole={userRole}
                    onChannelUpdate={() => mutate(`/api/chat/${selectedGroupID}`)}
                />)}
            </div>
        </div>

        {/* Main Chat Section */}
        <div className="flex-grow overflow-hidden">
            {isLoading ? (<div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>) : (<Chat
                disableInput={disableInput}
                userRole={userRole}
            />)}
        </div>
    </div>);
}
