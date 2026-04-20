"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSignOutMutation } from "@/redux/features/auth/auth.api";
import Link from "next/link";
import { SubscriptionType } from "@/types/subscription.types";
import { IUser } from "@/actions/user";
import { format, differenceInDays } from "date-fns";

interface UserInfoProps {
  user: IUser | null;
}

export function UserInfo({ user }: UserInfoProps) {
  const [logout, { isLoading }] = useSignOutMutation();

  const isSubscribed = user?.subscription?.status === "active";

  useEffect(() => {
    if (!isSubscribed) {
      toast.info("You don't have an active subscription", {
        toastId: "no-subscription",
      });
    }
  }, [isSubscribed]);

  const handleLogout = async () => {
    await logout(undefined);
    window.location.href = "/";
  };

  const subscriptionType = user?.subscription?.type as
    | SubscriptionType
    | undefined;

  const planLabel =
    subscriptionType === SubscriptionType.GREGMAT_PREPSWIFT
      ? "PrepSwift"
      : subscriptionType === SubscriptionType.GREGMAT
        ? "GregMat"
        : null;

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white ">
      {/* Header */}
      <div className="rounded-t-2xl bg-gray-50 px-8 py-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900">Your Account</h2>

        <p className="mt-3 text-lg font-medium text-gray-800">
          {user?.username}
        </p>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

      {/* Body */}
      <div className="px-8 py-6">
        {/* Subscription Info */}
        <div className="flex flex-col items-center gap-2">
          {isSubscribed ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              Active Subscription
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1 text-sm font-semibold text-red-600">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              No Active Subscription
            </span>
          )}

          {isSubscribed && planLabel && (
            <span className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              Plan: {planLabel}
            </span>
          )}

          {isSubscribed && user?.subscription && (
            <div className="mt-4 grid w-full grid-cols-2 gap-3 text-center text-sm">
              <div className="rounded-lg bg-gray-50 p-2">
                <p className="text-xs text-gray-500">Started</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(user.subscription.startDate), "MMM d, yyyy")}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2">
                <p className="text-xs text-gray-500">Expires</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(user.subscription.endDate), "MMM d, yyyy")}
                </p>
              </div>
              <div className="col-span-2 rounded-lg bg-blue-50 p-2">
                <p className="text-xs text-blue-600">Time Remaining</p>
                <p className="font-bold text-blue-700">
                  {differenceInDays(
                    new Date(user.subscription.endDate),
                    new Date(),
                  )}{" "}
                  Days
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          {isSubscribed ? (
            <Button className="w-full" disabled>
              You are Subscribed
            </Button>
          ) : (
            <Button className="w-full" asChild>
              <Link href="/pricing">Subscribe Now</Link>
            </Button>
          )}

          <Button variant="outline" className="w-full" asChild>
            <Link href="/pricing">View Pricing Plans</Link>
          </Button>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gray-200" />

        {/* Logout */}
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? "Signing out..." : "Sign Out"}
        </Button>
      </div>
    </div>
  );
}
