"use client";
import { signOut ,signIn} from "next-auth/react";
import { useSession } from "next-auth/react";
export default function Explore() {
    const session  = useSession();
    console.log(session.data?.user?.name);
    return (
        <div className="text-6xl text-center">
        <h1>Explore</h1>
        <h2>Session: {JSON.stringify(session?.user?.name)}</h2>
        <button onClick={() => signOut()}>Sign out</button>
        <br></br>
        <button onClick={() => signIn()}>Sign In</button>
        


        </div>
    );
    }   