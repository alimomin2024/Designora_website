"use client";

import { Badge } from "@/components/ui/badge";
import { Coins, Gift } from "lucide-react";

interface Props {
  credits: number;
  dailyFreeRemaining: number;
}

export default function UsageBadge({ credits, dailyFreeRemaining }: Props) {
  return (
    <div className="flex items-center gap-2">
      {dailyFreeRemaining > 0 && (
        <Badge className="gap-1 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <Gift className="h-3 w-3" />
          {dailyFreeRemaining} free today
        </Badge>
      )}
      <Badge className="gap-1 bg-primary/20 text-primary border-primary/30">
        <Coins className="h-3 w-3" />
        {credits} credits
      </Badge>
    </div>
  );
}
