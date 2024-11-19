"use client"

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/app/login/auth-context";

export default function Home() {
  const { loggedIn } = useAuth();

  return (
    <div>
      <ModeToggle />
      {loggedIn && <p>Logged in!</p>}
      <Link href="/login">
        <Button>Login</Button>
      </Link>
    </div>
  );
}