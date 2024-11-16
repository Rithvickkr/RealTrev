import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import TravelerDashboard from "@/app/components/tchatdemo";

export default async function Page() {
    const session = await getServerSession(authOptions);
    return <TravelerDashboard session={session} />;
    }