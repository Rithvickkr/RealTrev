import TravelChatPage from "@/app/components/chat";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth/next";

export default async function Page() {
  const session = await getServerSession(authOptions);

  return <TravelChatPage session={session} />;
}
