import {Edit, MoreHorizontal, Plus, Trash2} from 'lucide-react'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import Link from "next/link"
import useChatStore from "@/hooks/useChatStore"
import {useEffect, useState} from "react"
import {useAlert} from "@/components/alert-context"
import {createGroup, deleteGroup, renameGroup} from "@/actions/group-actions"
import { DeleteConfirmationDialog } from './ui/delete-alert'
import {cn} from "@/lib/utils"
import {usePathname} from "next/navigation";
import {mutate} from "swr";
import {getRole} from "@/lib/role";

export function NavChat({groups}) {

    const pathname = usePathname()
    const {isMobile} = useSidebar()
    const {selectedGroupID, setSelectedGroupID, setSelectedChannel} = useChatStore()
    const {showAlert} = useAlert()
    const [searchTerm, setSearchTerm] = useState('')

    // Group Management States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingGroup, setEditingGroup] = useState(null)
    const [editGroupName, setEditGroupName] = useState('')
    const [isDeletingGroup, setIsDeletingGroup] = useState(false)
    const [groupToDelete, setGroupToDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const [userRole, setUserRole] = useState('student')

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

    const onGroupUpdate = () => {
        mutate('/api/chat')
        mutate(`/api/chat/${selectedGroupID}`)
    }
    const handleGroupSelect = (groupId) => {
        if (selectedGroupID !== groupId) {
            setSelectedGroupID(groupId)
        }
    }

    // Create/Edit Group Handler
    const handleEditGroup = async (e) => {
        e.preventDefault()
        if (!editGroupName.trim()) {
            showAlert({
                message: "Group name cannot be empty", severity: "warning"
            })
            return
        }

        if (editingGroup) {
            try {
                const result = await renameGroup(editGroupName, editingGroup.group_id)
                if (result.status === 200) {
                    showAlert({
                        message: "Group updated successfully", severity: "success"
                    })
                    setIsEditModalOpen(false)
                    onGroupUpdate()
                } else {
                    showAlert({
                        message: result.message, severity: "error"
                    })
                }
            } catch (error) {
                showAlert({
                    message: "Failed to update group", severity: "error"
                })
            }
        } else {
            try {
                const result = await createGroup(editGroupName)
                if (result.status === 200) {
                    showAlert({
                        message: "Group created successfully", severity: "success"
                    })
                    setIsEditModalOpen(false)
                    onGroupUpdate()
                } else {
                    showAlert({
                        message: result.message, severity: "error"
                    })
                }
            } catch (error) {
                showAlert({
                    message: `Failed to create group: ${error}`, severity: "error"
                })
            }
        }
    }

    // Delete Group Handler
    const handleDeleteGroup = async () => {
        if (!groupToDelete) return

        setIsDeleting(true)
        try {
            const result = await deleteGroup(groupToDelete.group_id)
            if (result.status === 200) {
                showAlert({
                    message: "Group deleted successfully", severity: "success"
                })
                setIsDeletingGroup(false)
                setGroupToDelete(null)
                if (selectedGroupID === groupToDelete.group_id) {
                    setSelectedGroupID(null)
                    setSelectedChannel(null)
                }
                onGroupUpdate()
            } else {
                showAlert({
                    message: result.message || "Failed to delete group", severity: "error"
                })
            }
        } catch (error) {
            showAlert({
                message: "Failed to delete group", severity: "error"
            })
        } finally {
            setIsDeleting(false)
        }
    }

    // Filter groups based on search term

    return (<>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <div className="flex flex-row justify-between  py-2">
                <SidebarGroupLabel>Groups</SidebarGroupLabel>
                {userRole !== 'student' && (<Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                        setEditingGroup(null)
                        setEditGroupName('')
                        setIsEditModalOpen(true)
                    }}
                >
                    <Plus size={20} />
                </Button>)}
            </div>


            <SidebarMenu>
                {groups?.map((group) => (<SidebarMenuItem key={group.group_id}>
                    <SidebarMenuButton
                        asChild
                        className={cn(pathname.split('/')[1] === 'chat' && selectedGroupID === group.group_id && [
                            "relative",
                            "text-white",
                            "bg-gradient-to-r from-primary/90 to-primary",
                            "shadow-md",
                            "before:absolute before:inset-0 before:bg-primary/10 before:opacity-0 hover:before:opacity-20",
                            "transition-all duration-300 ease-in-out",
                            "border-l-4 border-purple-500"
                        ].join(" "))}
                    >
                        <Link
                            href={'/chat'}
                            onClick={() => handleGroupSelect(group.group_id)}
                        >
                            <span>{group.group_name}</span>
                        </Link>
                    </SidebarMenuButton>
                    {userRole !== 'student' && (<DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuAction showOnHover>
                                <MoreHorizontal size={16} color={'gray'} />
                                <span className="sr-only">More</span>
                            </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-48"
                            side={isMobile ? "bottom" : "right"}
                            align={isMobile ? "end" : "start"}
                        >
                            <DropdownMenuItem
                                onClick={() => {
                                    setEditingGroup(group)
                                    setEditGroupName(group.group_name)
                                    setIsEditModalOpen(true)
                                }}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit Group</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setGroupToDelete(group)
                                    setIsDeletingGroup(true)
                                }}
                                className="text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete Group</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>)}
                </SidebarMenuItem>))}
            </SidebarMenu>
        </SidebarGroup>

        {/* Edit Group Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {editingGroup ? 'Edit Group' : 'Create New Group'}
                    </DialogTitle>
                    <DialogDescription>
                        {editingGroup ? 'Modify group details' : 'Add a new group'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="groupName" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="groupName"
                            value={editGroupName}
                            onChange={(e) => setEditGroupName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        onClick={handleEditGroup}
                    >
                        {editingGroup ? 'Update Group' : 'Create Group'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Delete Group Confirmation */}
        <DeleteConfirmationDialog
            isOpen={isDeletingGroup}
            onClose={() => {
                setGroupToDelete(null)
                setIsDeletingGroup(false)
            }}
            onConfirm={handleDeleteGroup}
            itemName={groupToDelete?.group_name || ''}
            description="This will permanently delete the group and all its channels. This action cannot be undone."
        />
    </>)
}

export default NavChat

