import WalletBalance from "@/components/WalletBalance";
import TransactionHistory from "@/components/TransactionHistory";
import RewardsSection from "@/components/RewardsSection";
import ThemeToggle from "@/components/ThemeToggle";
import AddFundsButton from "@/components/AddFundsButton";
import ProgressStats from "@/components/ProgressStats";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth/next";
import { getUserDetails } from "@/app/lib/actions/aboutuser";
import TravelMinimalBackground from "@/app/components/background";

export default async function WalletPage() {
  const session = await getServerSession(authOptions);
  const user = await getUserDetails(session.user.id);
  

  return (
    <div>
      <TravelMinimalBackground />
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto  px-4 py-8">
        <div className="space-y-8 pt-10">
          <WalletBalance trevcoins={user?.trevCoins ?? 0} />
          <div className=" relative grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TransactionHistory transactions={user?.transactions.map((transaction: any) => ({
              ...transaction,
              date: transaction.createdAt.toISOString() 
            })) || []}/>
            <div className="space-y-8">
              <RewardsSection />
              <ProgressStats />
            </div>
          </div>
        </div>
      </main>
    </div>
    </div>
  );
}
