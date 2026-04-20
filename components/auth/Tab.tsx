import { cn } from "@/lib/utils";
import React from "react";

interface TabProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  setPosition: (pos: { left: number; width: number; opacity: number }) => void;
  onClick: () => void;
  isActive: boolean;
}

const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ children, icon, setPosition, onClick, isActive }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => {
        if (!ref || typeof ref === "function" || !ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({ left: ref.current.offsetLeft, width, opacity: 1 });
      }}
      className={cn(
        "relative z-10 flex  flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer ",
        isActive
          ? "text-primary-foreground bg-blue-500"
          : "text-muted-foreground hover:text-foreground ",
      )}
    >
      <span className="h-4 w-4">{icon}</span>
      <span className="hidden sm:inline">{children}</span>
    </button>
  ),
);

Tab.displayName = "Tab";
export default Tab;
