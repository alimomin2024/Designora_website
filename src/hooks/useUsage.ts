"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  getUserDoc,
  canUse,
  deductCredits,
  getToolCost,
  getDailyFreeRemaining,
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
      const today = new Date().toISOString().slice(0, 10);

      const applyLocalUsage = (useFree: boolean) => {
        setUserDoc((prev) => {
          if (!prev) return prev;
          if (useFree) {
            const sameDay = prev.dailyFreeDate === today;
            return {
              ...prev,
              dailyFreeDate: today,
              dailyFreeUsed: sameDay ? prev.dailyFreeUsed + 1 : 1,
            };
          }
          return {
            ...prev,
            credits: Math.max(0, prev.credits - cost),
          };
        });
      };

      try {
        const check = await canUse(user.uid, tool, tier);
        if (!check.allowed) return false;
        try {
          const ok = await deductCredits(user.uid, tool, tier);
          if (ok) {
            applyLocalUsage(check.useFree);
            await refresh();
          }
          return ok;
        } catch {
          // If usage is allowed but write fails (strict client rules/legacy docs),
          // don't block the tool action with an incorrect pricing redirect.
          applyLocalUsage(check.useFree);
          return true;
        }
      } catch {
        return false;
      }
    },
    [user, refresh],
  );

  const dailyFreeRemaining = userDoc ? getDailyFreeRemaining(userDoc) : 0;
  const credits = userDoc?.credits ?? 0;

  return {
    userDoc,
    loading,
    deduct,
    refresh,
    credits,
    dailyFreeRemaining,
  };
}
