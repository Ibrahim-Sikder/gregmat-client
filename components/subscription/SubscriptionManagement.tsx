"use client";

import {
  useGetMyActiveSubscriptionQuery,
  useGetMySubscriptionRequestsQuery,
  useGetMySubscriptionsQuery,
} from "@/redux/features/subscription/subscription.api";
import { SubscriptionType } from "@/types/subscription.types";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Calendar,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const formatBDT = (amount: number) => `৳${Math.round(amount)}`;

export default function SubscriptionManagement() {
  const { data: active, isLoading: l1 } =
    useGetMyActiveSubscriptionQuery(undefined);
  const { data: all, isLoading: l2 } = useGetMySubscriptionsQuery(undefined);
  const { data: requests, isLoading: l3 } =
    useGetMySubscriptionRequestsQuery(undefined);

  if (l1 || l2 || l3) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white dark:bg-gray-900 p-4">
      <Tabs defaultValue="active">
        {/* Tabs */}
        <TabsList className="mb-4 flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger className="flex-1 rounded-md" value="active">
            Active
          </TabsTrigger>
          <TabsTrigger className="flex-1 rounded-md" value="history">
            History
          </TabsTrigger>
          <TabsTrigger className="flex-1 rounded-md" value="requests">
            Requests
          </TabsTrigger>
        </TabsList>

        {/* ACTIVE */}
        <TabsContent value="active">
          {active?.data ? (
            <Card className="border border-gray-200 dark:border-gray-800 shadow-none">
              <CardContent className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {active.data.type === SubscriptionType.GREGMAT
                        ? "GregMat"
                        : "GregMat + PrepSwift"}
                    </h3>
                  </div>
                  <Badge className="capitalize">Active</Badge>
                </div>

                {/* Price */}
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 text-center">
                  <p className="text-sm text-gray-500">Monthly Price</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                    {formatBDT(active.data.price)}
                  </p>
                </div>

                {/* Dates */}
                <div className="space-y-2 text-sm">
                  <DateRow
                    icon={Calendar}
                    label="Start Date"
                    value={formatDateTime(active.data.startDate)}
                  />
                  <DateRow
                    icon={Calendar}
                    label="End Date"
                    value={formatDateTime(active.data.endDate)}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Empty text="You do not have an active subscription." />
          )}
        </TabsContent>

        {/* HISTORY */}
        <TabsContent value="history">
          {all?.data?.length ? (
            <div className="space-y-3">
              {all.data.map((s: any) => (
                <Card
                  key={s._id}
                  className="border border-gray-200 dark:border-gray-800 shadow-none"
                >
                  <CardContent className="p-4 space-y-2 ">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">
                        {s.type === SubscriptionType.GREGMAT
                          ? "GregMat"
                          : "GregMat + PrepSwift"}
                      </p>
                      <Badge variant="secondary">{formatBDT(s.price)}</Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(s.startDate)} →{" "}
                      {formatDateTime(s.endDate)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Empty text="No subscription history found." />
          )}
        </TabsContent>

        {/* REQUESTS */}
        <TabsContent value="requests">
          {requests?.data?.length ? (
            <div className="space-y-3">
              {requests.data.map((r: any) => (
                <Card
                  key={r._id}
                  className="border border-gray-200 dark:border-gray-800 shadow-none"
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {r.type === SubscriptionType.GREGMAT
                          ? "GregMat"
                          : "GregMat + PrepSwift"}
                      </p>
                      <StatusIcon status={r.status} />
                    </div>
                    <p className="text-xs text-gray-500">
                      Requested on {formatDateTime(r.createdAt)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Empty text="No subscription requests found." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ------------------ Helpers ------------------ */

function DateRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-gray-500" />
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "approved" || status === "active") {
    return <CheckCircle2 className="h-4 w-4 text-green-600" />;
  }
  if (status === "rejected") {
    return <XCircle className="h-4 w-4 text-red-600" />;
  }
  return <Clock className="h-4 w-4 text-yellow-500" />;
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
      {text}
    </div>
  );
}
