import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  selectedNow: boolean;
}

export default function ChoiceButton({ selectedNow }: Props) {
  return (
    <span
      className={cn(
        "cursor-pointer rounded-[50%] h-3 w-5 min-h-3 min-w-5 ring-1",
        selectedNow ? "bg-black ring-black" : "bg-transparent ring-black",
      )}
    />
  );
}
