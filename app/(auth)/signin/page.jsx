"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth, useSignIn, useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { getUser } from "@/hooks/get-userID";
import Loader from "@/components/Loader";
import Image from "next/image";
const formSchema = z.object({
  emailAddress: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const [clerkError, setClerkError] = useState("");
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const user = getUser();

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
    if (!isLoaded) return; // Ensure Clerk is loaded before proceeding
    setLoading(true);
    try {
      // console.log(values);
      const email = values.emailAddress;
      const password = values.password;

      const resp = await SignInWithEmail(email, password);
      if (resp.status === "complete")
        await setActive({ session: resp.createdSessionId }).then(() => {
          directUser();
        });
      else
        setClerkError(
          resp.errors ? resp.errors[0]?.message : "Something went wrong."
        );
    } catch (error) {
      setClerkError(
        error.errors ? error.errors[0]?.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }
  if (loading) return <Loader />;
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <div className="text-3xl mt-6 font-bold">Sign In</div>
      <div className="flex flex-row text-left">
        <div className="hidden md:flex p-8">
          <Image
            src="/studyGuy.jpeg"
            width={400}
            height={400}
            alt="Guy studying on a laptop"
          />
        </div>
        <div className=" m-8 flex flex-col justify-center">
          <Form {...signinform}>
            <form
              onSubmit={signinform.handleSubmit(onSubmit)}
              className="flex flex-col gap-8 sign-in-form"
            >
              <FormField
                control={signinform.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        type="email"
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
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
              <Button type="submit">Sign In</Button>
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
