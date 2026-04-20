"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { UserInfo } from "./UserInfo";

interface AccountDialogProps {
  user: any;
}

export function AccountDialog({ user }: AccountDialogProps) {
  const isSubscribed = user?.subscription?.status === "active";

  // 🔔 Toast ONLY once
  useEffect(() => {
    if (!open) return;

    if (!isSubscribed) {
      toast.info("You don't have an active subscription", {
        toastId: "no-subscription", // ✅ key fix
      });
    }
  }, [open, isSubscribed]);

  return <UserInfo user={user} />;
}
