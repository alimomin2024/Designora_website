"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  getUserDoc,
  canUse,
  deductCredits,
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
      if (!user) return false;
      try {
        const check = await canUse(user.uid, tool, tier);
        if (!check.allowed) return false;
        const ok = await deductCredits(user.uid, tool, tier);
        if (ok) await refresh();
        return ok;
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
