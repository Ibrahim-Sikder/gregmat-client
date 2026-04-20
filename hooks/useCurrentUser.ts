"use client";

import { useEffect, useState } from "react";
import fetchWrapper from "@/lib/fetchWrapper";
import { IUser } from "@/actions/user";

function normalizeUser(raw: any): IUser {
  return {
    _id: raw._id,
    uId: raw.uId,
    auth: raw.auth,
    username: raw.username,
    email: raw.email,
    profilePicture: raw.profilePicture || "",
    role: raw.role,
    isEmailVerified: raw.isEmailVerified,

    subscription: raw.subscription
      ? {
          _id: raw.subscription._id,
          type: raw.subscription.type,
          status: raw.subscription.status,
          price: raw.subscription.price,
          startDate: raw.subscription.startDate,
          endDate: raw.subscription.endDate,
          createdAt: raw.subscription.createdAt,
          updatedAt: raw.subscription.updatedAt,
        }
      : undefined,

    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export function useCurrentUser() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchUser() {
      try {
        const res = await fetchWrapper("/user/profile");
        if (mounted && res?.data) {
          setUser(normalizeUser(res.data));
        }
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    user,
    loading,

    // ✅ shortcuts (DX win)
    isAuthenticated: !!user,
    isSubscribed: user?.subscription?.status === "active",
    subscription: user?.subscription,
  };
}
