"use client";

import { useState, Key } from "react";
import { Search, Plane, Hotel, Utensils, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

enum TransactionType {
  EARNED,
  REDEEMED,
  BONUS,
}

export interface Transaction {
  id: Key;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  
}

export default function TransactionHistory({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter((t) =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.EARNED:
        return <Plane className="text-blue-400" />;
      case TransactionType.REDEEMED:
        return <Hotel className="text-green-400" />;
      case TransactionType.BONUS:
        return <Utensils className="text-yellow-400" />;
      default:
        return <ShoppingBag className="text-purple-400" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search transactions"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <li
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center">
                <div className="mr-4 animate-pulse">
                  {getIcon(transaction.type)}
                </div>
                <div>
                  <p className="font-semibold">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toISOString().split("T")[0]}
                  </p>
                </div>
              </div>
                <div className={`font-bold ${transaction.type === TransactionType.REDEEMED ? 'text-red-400' : 'text-yellow-400'}`}>
                {transaction.type === TransactionType.REDEEMED ? '-' : '+'} {transaction.amount} Trev Coins
                </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
