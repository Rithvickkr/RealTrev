import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import EnhancedTravelerQuerySubmission from "@/app/components/queryform";
export default async function Page() {
  const session = await getServerSession(authOptions);
  return <EnhancedTravelerQuerySubmission session={session} />;
}