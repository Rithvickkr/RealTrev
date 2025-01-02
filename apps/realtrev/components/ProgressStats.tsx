import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function ProgressStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Coins Earned This Month</span>
            <span className="text-sm font-medium">750/1000</span>
          </div>
          <Progress value={75} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Top Contributor Rank</span>
            <span className="text-sm font-medium">Silver</span>
          </div>
          <Progress value={60} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}

