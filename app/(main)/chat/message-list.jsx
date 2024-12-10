'use client'

import {useEffect, useState} from 'react'
import {Avatar, AvatarImage} from '@/components/ui/avatar'
import {useUser} from '@clerk/nextjs'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {deleteMessage, editMessage} from '@/actions/message-actions'
import {Check, Pencil, Trash2, X} from 'lucide-react'
import {getRole} from '@/lib/role'

const MessageList = ({messages, onMessageUpdate}) => {
    const {user} = useUser()
    const [editingMessageId, setEditingMessageId] = useState(null)
    const [editContent, setEditContent] = useState('')
    const [userRole, setUserRole] = useState('user')
    const [error, setError] = useState(null)

    // Fetch user role on component mount
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const role = await getRole()
                setUserRole(role)
            } catch (err) {
                console.error('Failed to fetch user role:', err)
                setError('Could not retrieve user permissions')
            }
        }
        fetchUserRole()
    }, [])

    // Handle message editing with improved error handling
    const handleEdit = async (messageId, newContent) => {
        if (!newContent.trim()) {
            setError('Message cannot be empty')
            return
        }

        try {
            const result = await editMessage(messageId, newContent)
            if (result.status === 201) {
                onMessageUpdate(messageId, newContent)
                setEditingMessageId(null)
                setError(null)
            } else {
                setError(result.error || 'Failed to edit message')
                console.error('Edit message error:', result)
            }
        } catch (err) {
            setError('An unexpected error occurred while editing')
            console.error('Edit message exception:', err)
        }
    }

    // Handle message deletion with improved error handling
    const handleDelete = async (messageId) => {
        try {
            const result = await deleteMessage(messageId)
            if (result.status === 200) {
                onMessageUpdate(messageId, null)
                setError(null)
            } else {
                setError(result.error || 'Failed to delete message')
                console.error('Delete message error:', result)
            }
        } catch (err) {
            setError('An unexpected error occurred while deleting')
            console.error('Delete message exception:', err)
        }
    }

    // Render a single message list item
    const createLi = (message) => {
        const isSentByCurrentUser = message.sender_id === user?.id
        const isEditing = editingMessageId === message.message_id
        const canModify = userRole === 'admin' || isSentByCurrentUser

        return (
            <li
                key={message.message_id}
                className={`flex ${
                    isSentByCurrentUser ? 'flex-row-reverse' : 'flex-row'
                } w-full items-start my-2`}
            >
                {/* Sender avatar */}
                {!isSentByCurrentUser && (
                    <div className="flex-shrink-0 mr-3">
                        <Avatar className="mr-2">
                            <AvatarImage src={message.img_url} />
                        </Avatar>
                    </div>
                )}

                <div className="flex flex-col w-full max-w-[80%]">
                    {/* Username for non-current user */}
                    {!isSentByCurrentUser && (
                        <div className="font-semibold text-sm mb-1">
                            {message.username || 'Anonymous'}
                        </div>
                    )}

                    {/* Editing mode */}
                    {isEditing ? (
                        <div
                            className={`flex items-center w-full ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`flex items-center ${isSentByCurrentUser ? 'bg-blue-100' : 'bg-slate-50'} rounded-xl p-2`}>
                                <Input
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="mr-2 w-full"
                                />
                                <div className="flex space-x-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleEdit(message.message_id, editContent)}
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setEditingMessageId(null)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Message content */}
                            <div
                                className={`whitespace-normal break-words p-4 max-w-[80%] ${
                                    isSentByCurrentUser
                                        ? 'bg-blue-100 rounded-l-xl rounded-br-xl self-end'
                                        : 'bg-slate-50 rounded-r-xl rounded-bl-xl self-start'
                                }`}
                            >
                                {message.content}
                            </div>

                            {/* Edit and delete buttons */}
                            {canModify && (
                                <div
                                    className={`flex ${
                                        isSentByCurrentUser ? 'self-end' : 'self-start'
                                    } space-x-1 mt-1 opacity-0 hover:opacity-100 transition-opacity`}
                                >
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 p-0"
                                        onClick={() => {
                                            setEditingMessageId(message.message_id)
                                            setEditContent(message.content)
                                        }}
                                    >
                                        <Pencil className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 p-0"
                                        onClick={() => handleDelete(message.message_id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </li>
        )
    }

    // Render error message if exists
    if (error) {
        return (
            <div className="w-full text-center text-red-500 p-4">
                {error}
            </div>
        )
    }

    return (
        <ul className="flex flex-col w-full space-y-2 overflow-y-auto">
            {messages.map(createLi)}
        </ul>
    )
}

export default MessageList