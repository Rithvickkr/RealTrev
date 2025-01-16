"use client";

import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import { Search, Plane, Hotel, Utensils, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface Transaction {
  id: Key | null | undefined;
  type: string;
  amount: number;
  description: string;
  date: string;
}

export default function TransactionHistory({ transactions }: { transactions: Transaction[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter(
    (t: { description: string }) =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "flight":
        return <Plane className="text-blue-400" />;
      case "hotel":
        return <Hotel className="text-green-400" />;
      case "food":
        return <Utensils className="text-yellow-400" />;
      case "shopping":
        return <ShoppingBag className="text-purple-400" />;
      default:
        return null;
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
          {filteredTransactions.map(
            (transaction: {
              id: Key | null | undefined;
              type: string;
              description:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<AwaitedReactNode>
                | null
                | undefined;
              date:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<AwaitedReactNode>
                | null
                | undefined;
              amount:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<AwaitedReactNode>
                | null
                | undefined;
            }) => (
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
                      {transaction.date}
                    </p>
                  </div>
                </div>
                <div className="font-bold text-yellow-400">
                  -{transaction.amount} Trev Coins
                </div>
              </li>
            )
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
