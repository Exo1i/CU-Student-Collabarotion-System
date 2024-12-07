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

    useEffect(() => {
        const fetchUserRole = async () => {
            const role = await getRole()
            setUserRole(role)
        }
        fetchUserRole()
    }, [])

    const handleEdit = async (messageId, newContent) => {
        const result = await editMessage(messageId, newContent)
        if (result.status === 201) {
            onMessageUpdate(messageId, newContent)
            setEditingMessageId(null)
        } else {
            console.error(result.error || result.message)
        }
    }

    const handleDelete = async (messageId) => {
        const result = await deleteMessage(messageId)
        if (result.status === 200) {
            onMessageUpdate(messageId, null) // null indicates message deletion
        } else {
            console.error(result.error || result.message)
        }
    }

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
                {!isSentByCurrentUser && (
                    <div className="flex-shrink-0 mr-3">
                        <Avatar className="mr-2">
                            <AvatarImage src={message.img_url} />
                        </Avatar>
                    </div>
                )}
                <div className="flex flex-col w-full max-w-[80%]">
                    {!isSentByCurrentUser && (
                        <div className="font-semibold text-sm mb-1">{message.username || 'anon'}</div>
                    )}
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
                            <div
                                className={`whitespace-normal break-words p-4 max-w-[80%] ${
                                    isSentByCurrentUser
                                        ? 'bg-blue-100 rounded-l-xl rounded-br-xl self-end'
                                        : 'bg-slate-50 rounded-r-xl rounded-bl-xl self-start'
                                }`}
                            >
                                {message.content}
                            </div>
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

    return (
        <ul className="flex flex-col w-full space-y-2 overflow-y-auto">
            {messages.map(createLi)}
        </ul>
    )
}

export default MessageList