"use client"

import React, {createContext, useCallback, useContext, useState} from 'react'
import {X} from 'lucide-react'
import {cva, type VariantProps} from "class-variance-authority"
import {cn} from "@/lib/utils"

const alertVariants = cva(
    "p-4 rounded-lg shadow-lg w-full transition-all duration-300 ease-in-out animate-slide-in",
    {
        variants: {
            severity: {
                info: "bg-blue-100 border-blue-500 text-blue-900",
                success: "bg-green-100 border-green-500 text-green-900",
                warning: "bg-yellow-100 border-yellow-500 text-yellow-900",
                error: "bg-red-100 border-red-500 text-red-900",
            },
        },
        defaultVariants: {
            severity: "info",
        },
    }
)

const containerVariants = cva(
    "fixed z-50 flex flex-col gap-2 max-w-sm w-full",
    {
        variants: {
            position: {
                "top-right": "top-4 right-4",
                "top-left": "top-4 left-4",
                "bottom-right": "bottom-4 right-4",
                "bottom-left": "bottom-4 left-4",
            },
        },
        defaultVariants: {
            position: "top-right",
        },
    }
)

interface AlertProps extends VariantProps<typeof alertVariants> {
    message: string
    position?: VariantProps<typeof containerVariants>["position"]
}

type AlertContextType = {
    showAlert: (props: AlertProps) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const useAlert = () => {
    const context = useContext(AlertContext)
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider')
    }
    return context
}

type AlertProviderProps = {
    children: React.ReactNode
}

export const AlertProvider: React.FC<AlertProviderProps> = ({children}) => {
    const [alerts, setAlerts] = useState<(AlertProps & { id: number; isLeaving: boolean })[]>([])
    const [nextId, setNextId] = useState(0)

    const showAlert = useCallback(({message, severity, position = "top-right"}: AlertProps) => {
        const id = nextId
        setNextId(prevId => prevId + 1)
        setAlerts(prevAlerts => [...prevAlerts, {id, message, severity, position, isLeaving: false}])

        // Start disappearing animation after 4.7 seconds
        setTimeout(() => {
            setAlerts(prevAlerts =>
                prevAlerts.map(alert =>
                    alert.id === id ? {...alert, isLeaving: true} : alert
                )
            )
        }, 4700)

        // Remove alert after animation completes (5 seconds total)
        setTimeout(() => {
            setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id))
        }, 5000)
    }, [nextId])

    const closeAlert = useCallback((id: number) => {
        setAlerts(prevAlerts =>
            prevAlerts.map(alert =>
                alert.id === id ? {...alert, isLeaving: true} : alert
            )
        )
        setTimeout(() => {
            setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id))
        }, 300)
    }, [])

    const alertsByPosition = alerts.reduce((acc, alert) => {
        const position = alert.position || "top-right"
        if (!acc[position]) {
            acc[position] = []
        }
        acc[position].push(alert)
        return acc
    }, {} as Record<string, typeof alerts>)

    return (
        <AlertContext.Provider value={{showAlert}}>
            {children}
            {Object.entries(alertsByPosition).map(([position, positionAlerts]) => (
                <div
                    key={position}
                    className={cn(
                        containerVariants({position: position as VariantProps<typeof containerVariants>["position"]})
                    )}
                >
                    {positionAlerts.map(({id, message, severity, isLeaving}) => (
                        <div
                            key={id}
                            className={cn(
                                alertVariants({severity}),
                                isLeaving && "animate-slide-out"
                            )}
                        >
                            <div className="flex justify-between items-start">
                                <p className="flex-grow">{message}</p>
                                <button
                                    onClick={() => closeAlert(id)}
                                    className="ml-4 text-gray-600 hover:text-gray-800 focus:outline-none"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </AlertContext.Provider>
    )
}

