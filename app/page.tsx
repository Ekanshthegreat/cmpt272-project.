"use client"

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/app/login/auth-context";

export default function Home() {
  const { loggedIn, logout} = useAuth();

  return (
    <div>
      <ModeToggle />
      {loggedIn ? (
        <>
          <p>Logged in!</p>
          <Button onClick={logout}>Logout</Button>
        </>
      ) : (
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      )}
    </div>
  );
}