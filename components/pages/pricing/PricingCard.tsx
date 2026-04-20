import React, { useState } from "react";
import { LucideIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/checkbox";
import { Input } from "@/components/ui/input";
import ModalContainer from "@/components/shared/modal/ModalContainer";
import VideoPlayer from "../recordings/VideoPlayer";
import SubscriptionRequestModal from "@/components/subscription/SubscriptionRequestModal";
import { SubscriptionType } from "@/types/subscription.types";
import clsx from "clsx";
import { useCurrentUserQuery } from "@/redux/features/auth/auth.api";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Tropic {
  tropicTitle: string;
  icon: LucideIcon;
}

interface PricingCardProps {
  tropics: Tropic[];
  price: string;
  priceValue: number;
  duration: string;
  description: string;
  features: string[];
  action?: string;
  subscriptionType: SubscriptionType;
  isPopular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  tropics,
  price,
  priceValue,
  duration,
  description,
  features,
  action,
  subscriptionType,
  isPopular = false,
}) => {
  const [checked, setChecked] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [open, setOpen] = useState(false);
  const [subscriptionRequestOpen, setSubscriptionRequestOpen] = useState(false);
  const router = useRouter();
  const { data: currentUser, isLoading: isUserLoading } =
    useCurrentUserQuery(undefined);

  const buttonClasses = clsx(
    "mt-6 w-full py-4 text-lg font-semibold",
    isPopular && "bg-blue-600 hover:bg-blue-700 text-white",
  );

  return (
    <div
      className={clsx(
        "relative flex flex-col rounded-2xl border bg-white dark:bg-gray-900 p-8  transition hover:shadow-lg",
        isPopular
          ? "border-blue-600 scale-[1.02]"
          : "border-gray-200 dark:border-gray-800",
      )}
    >
      {/* Popular Badge */}
      {isPopular && (
        <span className="absolute top-4 right-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          Most Popular
        </span>
      )}

      {/* Tropics */}
      <div className="flex justify-center gap-3 flex-wrap mb-6">
        {tropics.map((tropic, idx) => {
          const Icon = tropic.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5"
            >
              <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {tropic.tropicTitle}
              </span>
            </div>
          );
        })}
      </div>

      {/* Price */}
      <div className="text-center mb-4">
        <div className="flex justify-center items-end gap-2">
          <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
            {price}
          </span>
          <span className="text-sm text-gray-500">{duration}</span>
        </div>
        <p className="mt-3 text-gray-600 dark:text-gray-300">{description}</p>
      </div>

      {/* Features */}
      <ul className="mt-6 space-y-3 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* More Info */}
      {action && (
        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setOpen(true)}
          >
            More Information
          </Button>
        </div>
      )}

      {/* Terms */}
      <div className="flex gap-3 mt-6 items-start">
        <Checkbox
          id={`terms-${subscriptionType}`}
          checked={checked}
          onCheckedChange={(value) => setChecked(Boolean(value))}
        />
        <label
          htmlFor={`terms-${subscriptionType}`}
          className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"
        >
          I understand the <strong>{price}</strong> charge recurs monthly and is
          non-refundable if I forget to cancel.
        </label>
      </div>

      {/* Promo */}
      <div className="mt-4">
        {showPromo ? (
          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <Button onClick={() => setShowPromo(false)}>Apply</Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="px-0 text-blue-600"
            onClick={() => setShowPromo(true)}
          >
            Apply Promo Code
          </Button>
        )}
      </div>

      {/* CTA */}
      {currentUser ? (
        <Button
          className={buttonClasses}
          disabled={!checked || isUserLoading}
          onClick={() => setSubscriptionRequestOpen(true)}
        >
          Subscribe Now
        </Button>
      ) : (
        <Link href="/auth" className="w-full">
          <Button className={buttonClasses}>Login to Subscribe</Button>
        </Link>
      )}

      {/* Video Modal */}
      <ModalContainer open={open} onOpenChange={setOpen}>
        <div className="aspect-video w-full">
          <VideoPlayer videoUrl={action ?? ""} />
        </div>
      </ModalContainer>

      {/* Subscription Modal */}
      <SubscriptionRequestModal
        open={subscriptionRequestOpen}
        onOpenChange={setSubscriptionRequestOpen}
        subscriptionType={subscriptionType}
        price={priceValue}
        onSuccess={() => {
          setChecked(false);
          setSubscriptionRequestOpen(false);
        }}
      />
    </div>
  );
};

export default PricingCard;
