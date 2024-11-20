import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import TravelerDashboard from "@/app/components/tchatdemo";
import MyQueriesPage from "@/app/components/myqueries";

export default async function Page() {
    const session = await getServerSession(authOptions);
    
    return <MyQueriesPage session={session} />;
    }