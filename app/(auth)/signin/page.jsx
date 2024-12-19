'use client';

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import Image from "next/image";
import {useAuth, useSignIn} from "@clerk/nextjs";
import {BookOpen, Sparkles} from 'lucide-react';

const formSchema = z.object({
  emailAddress: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export default function SignInPage() {
    const {isLoaded, signIn, setActive} = useSignIn();
    const [clerkError, setClerkError] = useState("");
    const router = useRouter();
    const {isSignedIn} = useAuth();
    const [isSignin, setIsSignin] = useState(false)

  useEffect(() => {
    if (isSignedIn && isLoaded) router.push("/dashboard");
  }, [isSignedIn, isLoaded, router]);

  const signinform = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });

  const SignInWithEmail = async (emailAddress, password) => {
    return signIn.create({
      identifier: emailAddress,
      password: password,
      strategy: "password",
    });
  };

    async function onSubmit(values) {
        if (!isLoaded) return;
        try {
            setIsSignin(true);
            const email = values.emailAddress;
            const password = values.password;

            const resp = await SignInWithEmail(email, password);
            if (resp.status === "complete") {
                await setActive({session: resp.createdSessionId});
                router.push('/dashboard');
            } else {
                setClerkError(resp.errors ? resp.errors[0]?.message : "Something went wrong.");
            }
        } catch (error) {
            setClerkError(error.errors ? error.errors[0]?.message : "Something went wrong.");
        } finally {
            setIsSignin(false);
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
                    Welcome Back
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
                    <div className="w-full md:w-96 p-8">
                        <Form {...signinform}>
                            <form onSubmit={signinform.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={signinform.control}
                                    name="emailAddress"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground">Email Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your email"
                                                    type="email"
                                                    className="border-purple-200 focus:border-purple-500"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={signinform.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground">Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your password"
                                                    type="password"
                                                    className="border-purple-200 focus:border-purple-500"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {clerkError && (
                                    <p className="text-red-500 text-sm">{clerkError}</p>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isSignin}
                                    className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                                >
                                    {isSignin ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </form>
                        </Form>

          <div className="mt-6 space-y-4">
            <Button
              variant="ghost"
              className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              onClick={() => router.push("/reset-password")}
            >
              Forgot your password?
            </Button>
            <Button
              variant="ghost"
              className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              onClick={() => router.push("/signup")}
            >
              Need an account?{" "}
              <span className="ml-1 font-semibold">Sign Up</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
