import Link from "next/link"
import {cn} from "@/lib/utils"
import useChatStore from "@/hooks/useChatStore"
import {useAlert} from "@/components/alert-context"
import {ChevronRight, Edit, Plus, Trash2} from 'lucide-react'
import {useMemo, useState} from "react";
import {Input} from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {createChannel, deleteChannel, updateChannel} from "@/actions/channel-actions";
import {mutate} from "swr"
import { DeleteConfirmationDialog } from "@/components/ui/delete-alert"

export const ChannelsList = ({
                                 channels, setChannels, userRole, onChannelUpdate
                             }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const {selectedGroupID, selectedChannel, setSelectedChannel} = useChatStore()
    const {showAlert} = useAlert()

    // Edit Channel State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingChannel, setEditingChannel] = useState(null);
    const [editChannelName, setEditChannelName] = useState('');
    const [editChannelType, setEditChannelType] = useState('');

    // Delete Channel State
    const [isDeletingChannel, setIsDeletingChannel] = useState(false);
    const [channelToDelete, setChannelToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleChannelSelect = (channel) => {
        if (selectedChannel?.channel_num !== channel.channel_num) setSelectedChannel(channel)
    }

    // Edit Channel Handler
    const handleEditChannel = async (e) => {
        e.preventDefault()
        if (!editChannelName.trim()) {
            showAlert({
                message: "Channel name cannot be empty", severity: "warning"
            });
            return;
        }
        if (editingChannel) try {
            const result = await updateChannel(editChannelName, editChannelType, selectedGroupID, editingChannel.channel_num);
            if (selectedChannel.channel_num === editingChannel.channel_num) {
                setSelectedChannel({
                    channel_name: editChannelName,
                    channel_type: editChannelType,
                    group_id: selectedGroupID,
                    channel_num: editingChannel.channel_num
                })
            }
            setChannels(channels.map((channel) => channel.channel_num === editingChannel.channel_num && channel.group_id === selectedGroupID ? {
                channel_name: editChannelName,
                channel_type: editChannelType,
                group_id: selectedGroupID,
                channel_num: editingChannel.channel_num
            } : channel))

            if (result.status === 200) {
                showAlert({
                    message: "Channel updated successfully", severity: "success"
                });
                setIsEditModalOpen(false);
                mutate(`/api/chat/${selectedGroupID}/${selectedChannel.channel_num}`)
                onChannelUpdate();
            } else {
                showAlert({
                    message: result.message, severity: "error"
                });
            }
        } catch (error) {
            showAlert({
                message: "Failed to update channel", severity: "error"
            });
        } else try {
            const result = await createChannel(selectedGroupID, editChannelName, channels.length + 1, editChannelType);

            if (result.status === 200) {
                showAlert({
                    message: "Channel created successfully", severity: "success"
                });
                setIsEditModalOpen(false);
                onChannelUpdate();
            } else {
                showAlert({
                    message: result.message, severity: "error"
                });
            }
        } catch (error) {
            showAlert({
                message: `Failed to create channel, ${error}`, severity: "error"
            });
        }
    };

    // Delete Channel Handler
    const handleDeleteChannel = async () => {
        if (!channelToDelete) return;

        setIsDeleting(true);
        try {
            const result = await deleteChannel(selectedGroupID, channelToDelete.channel_num);

            if (result.status === 200) {
                showAlert({
                    message: "Channel deleted successfully", severity: "success"
                });
                setIsDeletingChannel(false);
                setChannelToDelete(null);
                setSelectedChannel(null);
                onChannelUpdate();
            } else {
                showAlert({
                    message: result.message || "Failed to delete channel", severity: "error"
                });
            }
        } catch (error) {
            showAlert({
                message: "Failed to delete channel", severity: "error"
            });
        } finally {
            setIsDeleting(false);
        }
    };

    // Memoized filtered channels
    const filteredChannels = useMemo(() => {
        if (!searchTerm) return channels;

        const searchTermLower = searchTerm.toLowerCase();
        return channels.filter(channel => channel.channel_name.toLowerCase().includes(searchTermLower) || (channel.channel_description && channel.channel_description.toLowerCase().includes(searchTermLower)));
    }, [channels, searchTerm]);

    // Only show management options for admins
    const canManageChannels = userRole === 'admin';


    return (<div className={'flex flex-col space-y-4'}>
        <div className="p-4 border-b">
            <div className="relative flex-grow">
                <Input
                    placeholder="Search Channels"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {canManageChannels && (<Button
                    variant="outline"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                    onClick={() => {
                        setEditingChannel(null);
                        setEditChannelName('');
                        setEditChannelType('');
                        setIsEditModalOpen(true);
                    }}
                >
                    <Plus size={20} />
                </Button>)}
            </div>
        </div>

        <nav aria-label="Channels navigation">
            <ul className="space-y-2 ">
                {selectedGroupID && filteredChannels?.map((channel) => (<li
                    key={channel.channel_num}
                    className={cn("group relative rounded transition-all  ", selectedChannel?.channel_num === channel.channel_num ? "bg-indigo-700 text-white" : "")}
                >
                    <Link
                        href={``}
                        onClick={() => handleChannelSelect(channel)}
                        className={cn("flex items-center px-2", canManageChannels ? "py-1" : "py-2", " rounded-md transition-all", selectedChannel?.channel_num === channel.channel_num ? "text-white font-medium" : "text-muted-foreground hover:bg-gray-100")}
                    >
                        <ChevronRight
                            strokeWidth={5}
                            className="mr-2 h-4 w-4"
                            color={selectedChannel?.channel_num === channel.channel_num ? 'white' : 'grey'}
                        />
                        <div className="flex-grow">{channel.channel_name}</div>

                        {canManageChannels && (<div
                            className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setEditingChannel(channel);
                                    setEditChannelName(channel.channel_name);
                                    setEditChannelType(channel.channel_type);
                                    setIsEditModalOpen(true);
                                }}
                            >
                                <Edit size={16} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setChannelToDelete(channel);
                                    setIsDeletingChannel(true);
                                }}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>)}
                    </Link>
                </li>))}
            </ul>
        </nav>

        {/* Edit Channel Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingChannel ? 'Edit Channel' : 'Create New Channel'}</DialogTitle>
                    <DialogDescription>
                        {editingChannel ? 'Modify channel details' : 'Add a new channel to your group'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="channelName" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="channelName"
                            value={editChannelName}
                            onChange={(e) => setEditChannelName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="channelType" className="text-right">
                            Type
                        </Label>
                        <Select
                            value={editChannelType}
                            onValueChange={setEditChannelType}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select channel type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="open">Open Channel</SelectItem>
                                <SelectItem value="restricted">Instructor and Admin only channel</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        onClick={handleEditChannel}
                    >
                        {editingChannel ? 'Update Channel' : 'Create Channel'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Delete Channel Confirmation */}
        <DeleteConfirmationDialog
            isOpen={isDeletingChannel}
            onClose={() => {
                setChannelToDelete(null);
                setIsDeletingChannel(false);
            }}
            onConfirm={handleDeleteChannel}
            itemName={channelToDelete?.channel_name || ''}
            description="This will permanently delete the channel. All messages in this channel will be lost."
        />
    </div>)
}

export default ChannelsList