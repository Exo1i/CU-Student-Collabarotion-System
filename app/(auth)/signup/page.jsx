"use client";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {useRouter} from "next/navigation";
import {useAuth, useSignUp} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import Image from "next/image";
import {useEffect, useState} from "react";
import VerifyingEmailView from "@/app/(auth)/signup/VerifyingEmailView";
import {Checkbox} from "@/components/ui/checkbox";

const formSchema = z.object({
    username: z.string().min(2, {message: "Username must be at least 4 characters."}),
    firstName: z.string().min(1, {message: "First name is required."}),
    lastName: z.string().min(1, {message: "Last name is required."}),
    emailAddress: z.string().email({message: "Invalid email address."}),
    password: z.string().min(6, {message: "Password must be at least 6 characters."}),
});

export default function SignInPage() {

    const [isInstructor, setIsInstructor] = useState(false)
    const {isLoaded, signUp, setActive} = useSignUp();
    const [clerkError, setClerkError] = useState("");
    const router = useRouter();
    const {isSignedIn} = useAuth();

    useEffect(() => {
        if (isSignedIn) {
            router.push("/dashboard"); // Redirect to a dashboard or any protected page
        }
    }, [isSignedIn, router]);


    const [isWaitingForCode, setWaitingForCode] = useState(false);
    const signUpform = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            firstName: "",
            lastName: "",
            emailAddress: "",
            password: "",
        },
    });

    const SignUpWithEmail = async (emailAddress, password, username, firstName, lastName) => {
        return signUp.create({
            emailAddress,
            password,
            username,
            firstName,
            lastName,
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

    return (isWaitingForCode ?
            <VerifyingEmailView signUp={signUp} isInstructor={isInstructor} setActive={setActive} /> :
            <div className="flex flex-col justify-center items-center h-screen w-screen">
                <div className="text-3xl font-bold text-center">Sign Up</div>
                <div className="flex flex-row items-center justify-center">
                    <div className="hidden md:flex p-8">
                        <Image
                            src="/studyGuy.jpeg"
                            width={400}
                            height={400}
                            alt="guy studying on a laptop"
                            className="object-cover rounded-lg"

                        />
                    </div>
                    <div className=" p-8 flex flex-col justify-center">
                        <Form {...signUpform}>
                            <form
                                onSubmit={signUpform.handleSubmit(onSubmit)}
                                className="flex flex-col gap-6 w-full"
                            >
                                <div className="flex flex-auto gap-6 w-full">
                                    <FormField
                                        control={signUpform.control}
                                        name="firstName"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} autoComplete="given-name" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signUpform.control}
                                        name="lastName"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} autoComplete="family-name" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={signUpform.control}
                                    name="username"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input {...field} autoComplete="username" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={signUpform.control}
                                    name="emailAddress"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input {...field} autoComplete="email" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className={"flex flex-row items-center justify-between"}>
                                    <FormField
                                        control={signUpform.control}
                                        name="password"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input {...field} autoComplete="new-password" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={signUpform.control}
                                        name="mobile"
                                        render={({field}) => (
                                            <FormItem
                                                className="flex flex-col space-x-3 space-y-0  p-4">
                                                <FormLabel>Instructor</FormLabel>
                                                <div className="flex flex-row space-x-3 space-y-0  p-4">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={isInstructor}
                                                            onCheckedChange={(val) => {
                                                                setIsInstructor(val)
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel>
                                                            Yes, I am an instructor
                                                        </FormLabel>
                                                    </div>
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                {clerkError && <p className="text-red-500 text-sm">{clerkError}</p>}
                                <Button type="submit">Create Account</Button>
                            </form>
                        </Form>
                        <Button
                            variant="none"
                            className={"w-full"}
                            onClick={() => router.push("/signin")}
                        >
                            Got an account already?
                            <div className="underline">Signin</div>
                        </Button>
                    </div>
                </div>

            </div>
    )
        ;
}


