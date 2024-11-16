import LocalGuideDashboard from "@/app/components/localdashboard";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
export default async function Page() {
  const session = await getServerSession(authOptions);
  return <LocalGuideDashboard session={session}/>;
}