"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/login/auth-context";

import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD_HASH = "e10adc3949ba59abbe56e057f20f883e"; // Example MD5 hash for "123456"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function CardWithForm() {
  const [showAlert, setShowAlert] = React.useState(false);
  const router = useRouter();
  const { setLoggedIn } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function hashPassword(password: string): Promise<string> {
    type HashifyResponse = { Digest: string };

    try {
      const response = await fetch(
        `https://api.hashify.net/hash/md5/hex?value=${password}`
      );

      if (!response.ok) {
        throw new Error("Failed to hash password with Hashify");
      }

      const data: HashifyResponse = await response.json();
      return data.Digest;
    } catch (error) {
      console.error("Hashify API Error:", error);
      // Return an empty string if the API fails
      return "";
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { username, password } = values;

    // Hash the input password
    const hashedPassword = await hashPassword(password);

    // Validate username and hashed password
    if (username === ADMIN_USERNAME && hashedPassword === ADMIN_PASSWORD_HASH) {
      // alert("Login successful!");
      setShowAlert(false);
      setLoggedIn(true);
      router.push("/"); // Navigate back to the home page
    } else {
      setShowAlert(true);
    }
  }

  return (
    <div className=" w-full flex flex-col items-center justify-start mt-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Login as an Admin to edit reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="username">Username</FormLabel>
                      <FormControl>
                        <Input
                          id="username"
                          placeholder="Username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <CardFooter className="flex justify-between">
                <Link href="../">
                  <Button variant="outline" type="button">
                    Back
                  </Button>
                </Link>
                <Button type="submit">Login</Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
      {showAlert && (
        <Alert variant="destructive" className="w-[350px] py-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Invalid username or password. Please try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
