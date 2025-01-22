"use client";

import { CoinsIcon as Coin, Plane, TrendingUp, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import NumberTicker from "./ui/number-ticker";

export default function WalletBalance(trevcoins: any) {
  const coins = trevcoins.trevcoins;
  return (
    <Card className="dark:bg-slate-300 bg-primary text-primary-foreground overflow-hidden relative">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Wallet Balance</h2>
            <div className="text-4xl font-bold flex items-center">
              <Coin className="mr-2 h-8 w-8 text-yellow-400 animate-bounce" />
              <span className="mr-2 whitespace-pre-wrap text-8xl font-medium tracking-tighter  dark:font-normal">
                <NumberTicker value={coins} />
              </span>
              <span className="text-xl font-normal">Trev Coins</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">
              Your Travel Rewards at a Glance
            </p>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <div className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
            <span className="text-sm">+50 coins this week</span>
          </div>
          <div className="flex items-center">
            <Award className="mr-2 h-5 w-5 text-yellow-400" />
            <span className="text-sm">Silver Member</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm">Next Reward: Free Hotel Night</span>
            <span className="text-sm">750/1000</span>
          </div>
          <div className="relative">
            <Progress value={75} className="h-2" />
          </div>
        </div>
      </CardContent>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary-foreground/10 dark:from-primary/30 dark:to-primary-foreground/5 rounded-lg shadow-lg transform -skew-y-6 scale-110 z-0"></div>
    </Card>
  );
}
