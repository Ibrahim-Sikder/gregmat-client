"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ModalContainer from "@/components/shared/modal/ModalContainer";
import { useState } from "react";
import { useCreateSubscriptionRequestMutation } from "@/redux/features/subscription/subscription.api";
import {
  SubscriptionType,
  type CreateSubscriptionRequestInput,
} from "@/types/subscription.types";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";

interface SubscriptionRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptionType: SubscriptionType;
  price: number;
  onSuccess?: () => void;
}

export default function SubscriptionRequestModal({
  open,
  onOpenChange,
  subscriptionType,
  price,
  onSuccess,
}: SubscriptionRequestModalProps) {
  const [message, setMessage] = useState("");
  const [createRequest, { isLoading }] = useCreateSubscriptionRequestMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: CreateSubscriptionRequestInput = {
        type: subscriptionType,
      };

      if (message.trim()) {
        payload.message = message.trim();
      }

      const result = await createRequest(payload).unwrap();

      if (result.success) {
        toast.success(
          result.message || "Subscription request submitted successfully!",
        );
        setMessage("");
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to submit subscription request",
      );
    }
  };

  const subscriptionTypeLabel =
    subscriptionType === SubscriptionType.GREGMAT
      ? "GregMat"
      : "GregMat + PrepSwift";

  return (
    <ModalContainer
      open={open}
      onOpenChange={onOpenChange}
      width="max-w-full md:max-w-lg mx-auto"
    >
      <div className="p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Request {subscriptionTypeLabel} Subscription
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Fill out the form below to request a subscription. Our admin will
          review your request and get back to you soon.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subscription-type" className="text-sm font-medium">
              Subscription Type
            </Label>
            <Input
              id="subscription-type"
              value={subscriptionTypeLabel}
              disabled
              className="mt-1 bg-gray-50 dark:bg-gray-800"
            />
          </div>

          <div>
            <Label htmlFor="price" className="text-sm font-medium">
              Price
            </Label>
            <Input
              id="price"
              value={`৳ ${price.toFixed(0)}`}
              disabled
              className="mt-1 bg-gray-50 dark:bg-gray-800 font-semibold"
            />
            <p className="text-xs text-gray-500 mt-1">
              Price will be set by admin upon approval
            </p>
          </div>

          <div>
            <Label htmlFor="message" className="text-sm font-medium">
              Message (Optional)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us why you'd like this subscription..."
              className="mt-1 min-h-[100px]"
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {message.length}/1000 characters
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </div>
    </ModalContainer>
  );
}
