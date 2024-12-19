'use client'

import {useState} from 'react'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {ArrowRight, BookOpen, Sparkles} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {useSignIn} from "@clerk/nextjs"

const emailSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
})

const resetSchema = z.object({
    otp: z.string().min(6, {message: "OTP must be at least 6 characters"}),
    newPassword: z.string().min(8, {message: "Password must be at least 8 characters"}),
})

export default function ResetPasswordPage() {
    const [step, setStep] = useState('email')
    const [error, setError] = useState(null)
    const [emailForReset, setEmailForReset] = useState("")
    const router = useRouter()
    const {signIn, setActive} = useSignIn()

    const emailForm = useForm({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: "",
        },
    })

    const resetForm = useForm({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            otp: "",
            newPassword: "",
        },
    })

    async function onEmailSubmit(values) {
        try {
            await signIn?.create({
                strategy: 'reset_password_email_code',
                identifier: values.email,
            })
            setError('')
            setEmailForReset(values.email)
            resetForm.reset()
            setStep('reset')
        } catch (err) {
            setError(err.errors[0].longMessage)
        }
    }

    async function onResetSubmit(values) {
        try {
            const result = await signIn?.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code: values.otp,
                password: values.newPassword,
            })

            if (result.status === 'complete') {
                setActive({session: result.createdSessionId})
                setError('')
                router.push('/dashboard')
            }
        } catch (err) {
            setError(err.errors[0].longMessage)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16 flex flex-col items-center">
                <div className="relative mb-8">
                    <div className="bg-gradient-to-br from-purple-400 via-violet-500 to-purple-600 rounded-full p-4">
                        <BookOpen className="w-16 h-16 text-white animate-bounce" />
                        <Sparkles className="w-6 h-6 text-purple-200 absolute -top-2 -right-2 animate-pulse" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-400 bg-clip-text text-transparent">
                    Reset Password
                </h1>

                <div className="flex flex-row items-center justify-center w-full max-w-4xl">
                    <div className="hidden md:flex p-8">
                        <Image
                            src="/studyGuy.jpeg"
                            width={400}
                            height={400}
                            alt="Guy studying on a laptop"
                            className="rounded-lg shadow-xl"
                        />
                    </div>
                    <div className="w-full md:w-96 p-8 bg-white rounded-lg shadow-sm">
                        {step === 'email' ? (
                            <Form {...emailForm}>
                                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                                    <FormField
                                        control={emailForm.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground">Email Address</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center space-x-2">
                                                        <Input
                                                            placeholder="Enter your email"
                                                            type="email"
                                                            className="border-purple-200 focus:border-purple-500"
                                                            {...field}
                                                        />
                                                        <Button
                                                            type="submit"
                                                            size="icon"
                                                            className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                                                        >
                                                            <ArrowRight className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        ) : (
                            <Form {...resetForm}>
                                <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
                                    <p className="text-sm text-muted-foreground">
                                        An OTP has been sent to {emailForReset}. Please check your email.
                                    </p>
                                    <FormField
                                        control={resetForm.control}
                                        name="otp"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground">OTP</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter OTP sent to your email"
                                                        className="border-purple-200 focus:border-purple-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={resetForm.control}
                                        name="newPassword"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground">New Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your new password"
                                                        type="password"
                                                        className="border-purple-200 focus:border-purple-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="min-h-[1.5rem]">
                                        {error && (
                                            <p className="text-red-500 text-sm">{error}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                                    >
                                        Reset Password
                                    </Button>
                                </form>
                            </Form>
                        )}

                        <div className="mt-6">
                            <Button
                                variant="ghost"
                                className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                onClick={() => router.push("/signin")}
                            >
                                Remember your password? <span className="ml-1 font-semibold">Sign In</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}