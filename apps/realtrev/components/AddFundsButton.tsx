import { Plane } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AddFundsButton() {
  return (
    <Button
      className="fixed bottom-6 right-6 rounded-full shadow-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900"
      size="lg"
    >
      <Plane className="mr-2 h-4 w-4" /> Add Travel Funds
    </Button>
  )
}

