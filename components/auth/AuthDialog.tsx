"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Lock, User, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import SlideTabs from "./SlideTabs";
import SignInForm from "../shared/forms/SignInForm";
import SignUpForm from "../shared/forms/SignUpForm";
import ForgotForm from "../shared/forms/ForgotForm";

export default function AuthDialog({
  open = true,
  onOpenChangeAction,
}: {
  open?: boolean;
  onOpenChangeAction?: (open: boolean) => void;
}) {
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const tabs = [
    { value: "login", label: "Sign In", icon: <Lock className="h-4 w-4" /> },
    { value: "register", label: "Sign Up", icon: <User className="h-4 w-4" /> },
    { value: "forgot", label: "Reset", icon: <Mail className="h-4 w-4" /> },
  ];

  const handleClose = () =>
    onOpenChangeAction ? onOpenChangeAction(false) : router.back();

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="max-w-md w-full p-0 gap-0 [&>button:last-child]:hidden">
        <DialogHeader className="relative p-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-semibold text-center">
            Welcome
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center mt-1">
            {activeTabIndex === 0 && "Sign in to your account"}
            {activeTabIndex === 1 && "Create your account"}
            {activeTabIndex === 2 && "Reset your password"}
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute right-4 top-4 h-8 w-8 rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <div className="p-6">
          <SlideTabs
            tabs={tabs}
            selected={activeTabIndex}
            onTabChange={setActiveTabIndex}
          />
          <div className="mt-4 border-t pt-4">
            {activeTabIndex === 0 && (
              <SignInForm onSwitchTab={(index) => setActiveTabIndex(index)} />
            )}
            {activeTabIndex === 1 && (
              <SignUpForm onSwitchTab={(index) => setActiveTabIndex(index)} />
            )}
            {activeTabIndex === 2 && (
              <ForgotForm onSwitchTab={(index) => setActiveTabIndex(index)} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
