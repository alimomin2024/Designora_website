"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  getUserDoc,
  canUse,
  deductCredits,
  getToolCost,
  type ToolName,
  type UserDoc,
} from "@/lib/firestore";

export function useUsage() {
  const { user } = useAuth();
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setUserDoc(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const d = await getUserDoc(user.uid);
      setUserDoc(d);
    } catch {
      setUserDoc(null);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const deduct = useCallback(
    async (tool: ToolName, tier?: string): Promise<boolean> => {
      const cost = getToolCost(tool, tier);
      if (cost === 0) return true;
      if (!user) return false;
      const applyLocalUsage = () => {
        setUserDoc((prev) => {
          if (!prev) return prev;
          return { ...prev, credits: Math.max(0, prev.credits - cost) };
        });
      };

      try {
        const check = await canUse(user.uid, tool, tier);
        if (!check.allowed) return false;
        try {
          const ok = await deductCredits(user.uid, tool, tier);
          if (ok) {
            applyLocalUsage();
            await refresh();
          }
          return ok;
        } catch {
          applyLocalUsage();
          return true;
        }
      } catch {
        return false;
      }
    },
    [user, refresh],
  );

  const credits = userDoc?.credits ?? 0;

  return {
    userDoc,
    loading,
    deduct,
    refresh,
    credits,
  };
}
