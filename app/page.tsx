"use client"
import * as React from "react";
// import { useAuth } from "@/app/login/auth-context";

import dynamic from 'next/dynamic';
import EmergencyTable from "@/components/emergency-table";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// import Map from "@/components/map";

const Map = dynamic(() => import('@/components/map'), {
  ssr: false, // This line is important. It's what prevents server-side render
});

export default function Home() {
  // const { loggedIn, logout} = useAuth();

  return (
    <div className="container">
      <h1>Home</h1>
      <div className="container space-y-8 py-8">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <Map />
        </AspectRatio>
        <EmergencyTable />
      </div>


      {/* <ModeToggle />
      {loggedIn ? (
        <>
          <p>Logged in!</p>
          <Button onClick={logout}>Logout</Button>
        </>
      ) : (
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      )} */}
    </div>
  );
}
