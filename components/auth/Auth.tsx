"use client";
import { Lock, Mail, User } from "lucide-react";
import React, { useState } from "react";
import SlideTabs from "./SlideTabs";
import SignInForm from "../shared/forms/SignInForm";
import SignUpForm from "../shared/forms/SignUpForm";
import ForgotForm from "../shared/forms/ForgotForm";

export default function Auth(redirectTo: string | any) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const tabs = [
    { value: "login", label: "Sign In", icon: <Lock className="h-4 w-4" /> },
    { value: "register", label: "Sign Up", icon: <User className="h-4 w-4" /> },
    { value: "forgot", label: "Reset", icon: <Mail className="h-4 w-4" /> },
  ];
  return (
    <div className="max-w-lg mx-auto p-6 gap-0 border border-gray-00 rounded-lg my-10">
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
  );
}
