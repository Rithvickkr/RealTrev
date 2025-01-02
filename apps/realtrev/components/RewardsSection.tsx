'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plane, Hotel, Umbrella, Camera } from 'lucide-react'

const rewards = [
  { id: 1, name: 'Flight Upgrade', cost: 500, description: 'Upgrade to business class', icon: Plane },
  { id: 2, name: 'Luxury Hotel Stay', cost: 1000, description: '5-star hotel night', icon: Hotel },
  { id: 3, name: 'Beach Day Package', cost: 300, description: 'All-inclusive beach day', icon: Umbrella },
  { id: 4, name: 'Photo Tour', cost: 200, description: 'Guided photo tour of the city', icon: Camera },
]

export default function RewardsSection() {
  const [hoveredReward, setHoveredReward] = useState<number | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Travel Rewards</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map(reward => (
            <Card 
              key={reward.id} 
              className="bg-muted transition-all duration-300 hover:scale-105"
              onMouseEnter={() => setHoveredReward(reward.id)}
              onMouseLeave={() => setHoveredReward(null)}
            >
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <reward.icon className={`h-6 w-6 mr-2 ${hoveredReward === reward.id ? 'animate-bounce' : ''}`} />
                  <h3 className="text-lg font-semibold">{reward.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-yellow-400">{reward.cost} Trev Coins</span>
                  <Button variant="outline" size="sm">Redeem</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

