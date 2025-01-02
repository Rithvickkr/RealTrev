import WalletBalance from '@/components/WalletBalance'
import TransactionHistory from '@/components/TransactionHistory'
import RewardsSection from '@/components/RewardsSection'
import ThemeToggle from '@/components/ThemeToggle'
import AddFundsButton from '@/components/AddFundsButton'
import ProgressStats from '@/components/ProgressStats'
import QRCodeGenerator from '@/components/QRCodeGenerator'

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Trev Wallet</h1>
          <ThemeToggle />
        </div>
        <div className="space-y-8">
          <WalletBalance />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TransactionHistory />
            <div className="space-y-8">
              <RewardsSection />
              <ProgressStats />
              <QRCodeGenerator />
            </div>
          </div>
        </div>
      </main>
      <AddFundsButton />
    </div>
  )
}

