'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

const cities = [
  { name: 'New York', x: 25, y: 40 },
  { name: 'London', x: 45, y: 35 },
  { name: 'Tokyo', x: 80, y: 45 },
  { name: 'Sydney', x: 85, y: 75 },
  { name: 'Rio de Janeiro', x: 35, y: 70 },
]

export default function TravelMap() {
  const [activeCity, setActiveCity] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCity((prev) => (prev + 1) % cities.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-gray-800/50 backdrop-blur-md">
    </Card>
  )
}

