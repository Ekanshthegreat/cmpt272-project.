"use client";

import React from "react";

import { Button } from "./ui/button";
import Link from "next/link";
import { Globe } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useAuth } from "@/app/login/auth-context";
import { Separator } from "@/components/ui/separator";

export default function Header() {
  const { loggedIn, logout } = useAuth();
  return (
    <div className="flex items-center justify-between m-5 h-16 rounded-full border shadow-lg">
      <Link href="/" className="flex ml-6 gap-2">
        <Globe />
        <h1 className="text-blue-600 text-xl">
          <strong>METRO</strong>VANCOUVER
        </h1>
      </Link>
      <div className="mr-3 gap-2 flex items-center">
        <Link href="/">
          <Button variant="ghost" className="text-md font-sans">
            Home
          </Button>
        </Link>
        <Link href="/form">
          <Button variant="ghost" className="text-md font-sans">
            Report
          </Button>
        </Link>
        <Link href="/about">
          <Button variant="ghost" className="text-md font-sans">
            About
          </Button>
        </Link>
        {loggedIn ? (
          <div className="flex gap-2 items-center">
            <p>Logged in!</p>
            <Button
              variant="ghost"
              onClick={logout}
              className="text-md font-sans"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="ghost" className="text-md font-sans">
              Login
            </Button>
          </Link>
        )}
        <Separator
          orientation="vertical"
          className="h-6 ml-2 mr-2 bg-gray-300"
        ></Separator>

        <ModeToggle />
      </div>
    </div>
  );
}
