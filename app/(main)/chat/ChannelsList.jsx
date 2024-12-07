import Link from "next/link"
import {cn} from "@/lib/utils"
import useChatStore from "@/hooks/useChatStore"
import {useAlert} from "@/components/alert-context"
import {ChevronRight} from 'lucide-react'


export const ChannelsList = ({channels}) => {
    const {selectedChannel, setSelectedChannel} = useChatStore()
    const {showAlert} = useAlert()

    const handleChannelSelect = (channel) => {
        if (selectedChannel?.channel_num !== channel.channel_num)
            setSelectedChannel(channel)
        // showAlert({
        //     message: `Switched to channel: ${channel.channel_name}`,
        //     severity: "info",
        // })
    }

    return (
        <nav aria-label="Channels navigation">
            <ul className="space-y-1">
                {channels?.map((channel) => (
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
    )
}

export default ChannelsList

