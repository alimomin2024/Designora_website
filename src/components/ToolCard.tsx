"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  gradient: string;
  creditCost?: number;
}

export default function ToolCard({
  icon: Icon,
  title,
  description,
  href,
  gradient,
  creditCost = 1,
}: Props) {
  return (
    <Link href={href} className="group block">
      <div className="glass gradient-border h-full rounded-2xl p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-primary/5">
        <div className="flex items-start justify-between">
          <div
            className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}
          >
            <Icon className="h-6 w-6 text-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">
            {creditCost} credit{creditCost !== 1 ? "s" : ""}
          </span>
        </div>
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          Open tool <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
