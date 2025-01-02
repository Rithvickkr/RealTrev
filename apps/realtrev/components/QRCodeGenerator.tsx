'use client'

import { useState } from 'react'
import { QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function QRCodeGenerator() {
  const [qrValue, setQRValue] = useState('')

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter amount for transfer"
            value={qrValue}
            onChange={(e) => setQRValue(e.target.value)}
          />
          <Button onClick={() => setQRValue(`trevwallet:transfer:${qrValue}`)}>
            Generate Transfer QR
          </Button>
          {qrValue && (
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <QrCode size={200} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

