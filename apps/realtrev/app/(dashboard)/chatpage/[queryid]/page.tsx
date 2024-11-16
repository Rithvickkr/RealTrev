import ChatPage from "@/app/components/chatdemo";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";


export default async function Page() {
  const session = await getServerSession(authOptions);
  console.log("Session", session.user.id);  // Debug session
  
  
  return <ChatPage session={session} />;
}