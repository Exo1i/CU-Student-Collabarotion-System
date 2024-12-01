'use client'

import {useState} from 'react'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {ArrowRight} from 'lucide-react'

import {Button} from '@/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {useSignIn} from "@clerk/nextjs";

const emailSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
})

const resetSchema = z.object({
    otp: z.string().min(6, {message: "OTP must be at least 6 characters"}),
    newPassword: z.string().min(8, {message: "Password must be at least 8 characters"}),
})

export default function Page() {
    const [step, setStep] = useState('email')
    const [error, setError] = useState(null)
    const [emailForReset, setEmailForReset] = useState("")
    const router = useRouter()
    const {signIn, setActive} = useSignIn();

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
        await signIn
            ?.create({
                strategy: 'reset_password_email_code',
                identifier: values.email,
            })
            .then((_) => {
                setError('')
                setEmailForReset(values.email)
                resetForm.reset(); // Reset the reset form values
                setStep('reset')
            })
            .catch((err) => {
                console.error('error', err.errors[0].longMessage)
                setError(err.errors[0].longMessage)
            })
    }

    async function onResetSubmit(values) {
        setError(null)
        await signIn
            ?.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code: values.otp,
                password: values.newPassword,
            })
            .then((result) => {
                if (result.status === 'complete') {
                    // Set the active session to
                    // the newly created session (user is now signed in)
                    setActive({session: result.createdSessionId})
                    setError('')
                    router.push('/dashboard')
                } else {
                    console.log(result)
                }
            })
            .catch((err) => {
                console.error('error', err.errors[0].longMessage)
                setError(err.errors[0].longMessage)
            })
    }


    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen">
            <div className="text-3xl mt-6 font-bold">Reset Password</div>
            <div className="flex flex-row text-left">
                <div className="hidden md:flex p-8">
                    <Image
                        src="/studyGuy.jpeg"
                        width={400}
                        height={400}
                        alt="Guy studying on a laptop"
                    />
                </div>
                <div className="m-8 flex flex-col justify-center">
                    {step === 'email' ? (
                        <Form {...emailForm}>
                            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="flex flex-col gap-8">
                                <FormField
                                    control={emailForm.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center">
                                                    <Input
                                                        placeholder="Enter your email"
                                                        type="email"
                                                        {...field}
                                                    />
                                                    <Button type="submit" size="icon" className="ml-2">
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
                            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="flex flex-col gap-8">
                                <p className="text-sm text-muted-foreground mb-4">
                                    An OTP has been sent to {emailForReset}. Please check your email.
                                </p>
                                <FormField
                                    control={resetForm.control}
                                    name="otp"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>OTP</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter OTP sent to your email"
                                                    {...field}
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.target.value)}
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
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your new password"
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {error && (
                                    <p className="text-red-500 text-sm">{error}</p>
                                )}
                                <Button type="submit">Reset Password</Button>
                            </form>
                        </Form>
                    )}
                    <Button
                        variant="ghost"
                        className="w-full mt-3"
                        onClick={() => router.push("/signin")}
                    >
                        Remember your password?
                        <span className="uppercase underline ml-1">Sign In</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

