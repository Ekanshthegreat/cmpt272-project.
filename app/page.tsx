import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <ModeToggle />
      <Link href="/login">
        <Button>Login</Button>
      </Link>
    </div>
  );
}
