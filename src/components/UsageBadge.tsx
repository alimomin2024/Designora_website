"use client";

import { Badge } from "@/components/ui/badge";
import { Coins } from "lucide-react";

interface Props {
  credits: number;
}

export default function UsageBadge({ credits }: Props) {
  return (
    <Badge className="gap-1 bg-primary/20 text-primary border-primary/30">
      <Coins className="h-3 w-3" />
      {credits} credits
    </Badge>
  );
}
