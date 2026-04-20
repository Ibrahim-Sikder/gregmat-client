"use client";

import { CircleParking, GraduationCap, Loader2 } from "lucide-react";
import PricingCard from "./PricingCard";
import { SubscriptionType } from "@/types/subscription.types";
import { useGetSubscriptionPricesQuery } from "@/redux/features/subscription/subscription.api";
import { useCurrentUserQuery } from "@/redux/features/auth/auth.api";

const defaultPricingData = [
  {
    tropics: [
      {
        tropicTitle: "GregMat",
        icon: GraduationCap,
      },
    ],
    duration: "per month",
    subscriptionType: SubscriptionType.GREGMAT,
    description:
      "GregMat+ is the most affordable test prep service on the market and provides you with tons of features.",
    features: [
      "Weekly Live Classes and hundreds of Class Recordings",
      "1 & 2 month GRE Study Plan",
      "2 week TOEFL Study Plan",
      "100+ Quizzes & 3 Full Practice Tests",
      "1000+ Practice Problems",
      "Vocab & Quant Memorization Tools",
    ],
  },
  {
    tropics: [
      { tropicTitle: "GregMat", icon: GraduationCap },
      { tropicTitle: "PrepSwift", icon: CircleParking },
    ],
    duration: "per month",
    subscriptionType: SubscriptionType.GREGMAT_PREPSWIFT,
    description:
      "PrepSwift is an add-on service with concise videos for fast revision.",
    features: [
      "All GregMat+ features",
      "Hundreds of short concept videos",
      "To-the-point strategy lessons",
      "“I'm Overwhelmed” Study Plan",
      "Perfect for busy students",
    ],
  },
];

export default function Pricing() {
  const { data: pricesMap, isLoading } =
    useGetSubscriptionPricesQuery(undefined);

  const gregmatUSD = pricesMap?.data?.gregmat ?? 7.99;
  const prepswiftUSD = pricesMap?.data?.gregmat_prepswift ?? 9.99;

  const pricingData = defaultPricingData.map((plan) => {
    const price =
      plan.subscriptionType === SubscriptionType.GREGMAT
        ? gregmatUSD
        : prepswiftUSD;

    return {
      ...plan,
      price: `৳${price.toFixed(0)}`,
      priceValue: price,
    };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          Pricing
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Simple, affordable pricing for serious test-takers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {pricingData.map((plan) => (
          <PricingCard
            key={plan.subscriptionType}
            {...plan}
            isPopular={
              plan.subscriptionType === SubscriptionType.GREGMAT_PREPSWIFT
            }
          />
        ))}
      </div>
    </section>
  );
}
