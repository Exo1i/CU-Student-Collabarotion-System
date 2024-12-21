'use client'
import VerifyingEmailView from "@/app/(auth)/signup/VerifyingEmailView";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import Image from "next/image";
import {BookOpen, Sparkles} from "lucide-react";
import {z} from "zod";
import {useEffect, useState} from "react";
import {useAuth, useSignUp} from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const signUpFormSchema = z.object({
    username: z.string().min(2, {message: "Username must be at least 4 characters."}),
    firstName: z.string().min(1, {message: "First name is required."}),
    lastName: z.string().min(1, {message: "Last name is required."}),
    emailAddress: z.string().email({message: "Invalid email address."}),
    password: z.string().min(6, {message: "Password must be at least 6 characters."}),
});

export default function SignUpPage() {
    const {isLoaded, signUp, setActive} = useSignUp();
    const [clerkError, setClerkError] = useState("");
    const router = useRouter();
    const {isSignedIn} = useAuth();
    const [isWaitingForCode, setWaitingForCode] = useState(false);

    useEffect(() => {
        if (isSignedIn) {
            router.push("/dashboard");
        }
    }, [isSignedIn, router]);

    const signUpform = useForm({
        resolver: zodResolver(signUpFormSchema), defaultValues: {
            username: "", firstName: "", lastName: "", emailAddress: "", password: "",
        },
    });

    const SignUpWithEmail = async (emailAddress, password, username, firstName, lastName) => {
        return signUp.create({
            emailAddress, password, username, firstName, lastName,
        });
    };

    async function onSubmit(values) {
        if (!isLoaded) return;

        try {
            const {emailAddress, password, username, firstName, lastName} = values;

            const resp = await SignUpWithEmail(emailAddress, password, username, firstName, lastName);

            if (resp.status === "missing_requirements") {
                await signUp.prepareVerification({strategy: "email_code"}).then(() => {
                    setWaitingForCode(true);
                });
            } else {
                setClerkError(resp.errors?.[0]?.message || "Something went wrong.");
            }
        } catch (error) {
            setClerkError(error.errors?.[0]?.message || "Something went wrong.");
        }
    }

    if (isWaitingForCode) {
        return <VerifyingEmailView signUp={signUp} setActive={setActive} />;
    }

    return (<div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center">
            <div className="relative mb-8">
                <div className="bg-gradient-to-br from-purple-400 via-violet-500 to-purple-600 rounded-full p-4">
                    <BookOpen className="w-16 h-16 text-white animate-bounce" />
                    <Sparkles className="w-6 h-6 text-purple-200 absolute -top-2 -right-2 animate-pulse" />
                </div>
            </div>

            <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-400 bg-clip-text text-transparent">
                Create Your Account
            </h1>

            <div className="flex flex-row items-center justify-center w-full max-w-4xl">
                <div className="hidden md:flex p-8">
                    <Image
                        src="/studyGuy.jpeg"
                        width={400}
                        height={400}
                        alt="guy studying on a laptop"
                        className="rounded-lg shadow-xl"
                    />
                </div>
                <div className="w-full md:w-96 p-8">
                    <Form {...signUpform}>
                        <form onSubmit={signUpform.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={signUpform.control}
                                    name="firstName"
                                    render={({field}) => (<FormItem>
                                        <FormLabel className="text-foreground">First Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="border-purple-200 focus:border-purple-500"
                                                {...field}
                                                autoComplete="given-name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>)}
                                />
                                <FormField
                                    control={signUpform.control}
                                    name="lastName"
                                    render={({field}) => (<FormItem>
                                        <FormLabel className="text-foreground">Last Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="border-purple-200 focus:border-purple-500"
                                                {...field}
                                                autoComplete="family-name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>)}
                                />
                            </div>

                            <FormField
                                control={signUpform.control}
                                name="username"
                                render={({field}) => (<FormItem>
                                    <FormLabel className="text-foreground">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-purple-200 focus:border-purple-500"
                                            {...field}
                                            autoComplete="username"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>)}
                            />

                            <FormField
                                control={signUpform.control}
                                name="emailAddress"
                                render={({field}) => (<FormItem>
                                    <FormLabel className="text-foreground">Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-purple-200 focus:border-purple-500"
                                            {...field}
                                            autoComplete="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>)}
                            />

                            <FormField
                                control={signUpform.control}
                                name="password"
                                render={({field}) => (<FormItem>
                                    <FormLabel className="text-foreground">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            className="border-purple-200 focus:border-purple-500"
                                            {...field}
                                            autoComplete="new-password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>)}
                            />


                            {clerkError && (<p className="text-red-500 text-sm">{clerkError}</p>)}

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                            >
                                Create Account
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6">
                        <Button
                            variant="ghost"
                            className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                            onClick={() => router.push("/signin")}
                        >
                            Already have an account? <span className="ml-1 font-semibold">Sign In</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}