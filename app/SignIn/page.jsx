"use client";
import react from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import Image from "next/image";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function SignInPage() {
  const signUpform = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      emailAddress: "",
      userName: "",
    },
  });
  const signinform = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      emailAddress: "",
    },
  });

  function onSubmit(values) {
    console.log(values);
  }
  const handleSignUpClick = function () {
    document.querySelector(".sign-in-form").classList.add("hidden");
    document.querySelector(".sign-up-form").classList.remove("hidden");
  };
  return (
    <div className="flex flex-col w-full lg:flex-row place-content-center items-center gap-12 h-screen">
      <Image
        src="/images/studyGuy.jpeg"
        width={400}
        height={400}
        alt="guy studying on a laptop"
      />
      <div className="w-80 lg:w-1/4">
        <Form {...signinform}>
          <form
            onSubmit={signinform.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 sign-in-form"
          >
            <h1 className="text-3xl font-bold">Sign In</h1>
            <FormField
              control={signinform.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter your email"
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
                      placeholder="enter your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <a href="#" className="text-right text-sky-500">
                    <p className="mt-3 underline"> Forgot your password?</p>
                  </a>
                </FormItem>
              )}
            />
            <Button type="submit">Sign In</Button>
            <button onClick={handleSignUpClick}>
              <p className="-mt-5">
                Need an account?
                <span className="uppercase underline">Sign Up</span>
              </p>
            </button>
          </form>
        </Form>

        <Form {...signUpform}>
          <form
            onSubmit={signUpform.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 hidden sign-up-form"
          >
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <FormField
              control={signUpform.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter your name"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signUpform.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter your email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signUpform.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Create Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Sign Up</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
