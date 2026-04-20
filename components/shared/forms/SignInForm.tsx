"use client";
import { CardContent } from "@/components/ui/card";
import { useSignInMutation } from "@/redux/features/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import SubmitButton from "../button/SubmitButton";
import TextInput from "../inputs/TextInput";
import { ReusableForm } from "./ReusableForm";
import { signInSchema } from "./validations/auth";
import { useSearchParams } from "next/navigation";

type SignInFormProps = {
  onSwitchTab?: (tabIndex: number) => void;
  redirectTo?: string | undefined;
};

export default function SignInForm({ onSwitchTab }: SignInFormProps) {
  const [signIn, { isLoading }] = useSignInMutation();
  const searchParams = useSearchParams();

  const defaultValues = {
    email: "bablu22@gmail.com",
    password: "12345678A!",
  };

  async function onSubmit(data: FieldValues) {
    try {
      const res = await signIn(data).unwrap();
      if (res.user?._id) {
        toast.success("Sign In Successful");
        window.location.href = searchParams.get("redirect") || "/";
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Sign In Failed. Please check your credentials.",
      );
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <ReusableForm
        onSubmit={onSubmit}
        resolver={zodResolver(signInSchema)}
        defaultValues={defaultValues}
      >
        <CardContent className="space-y-4">
          <TextInput
            label="Email Address"
            name="email"
            type="email"
            icon={Mail}
            placeholder="Enter your email"
          />

          {/* Password */}
          <TextInput
            label="Password"
            name="password"
            type="password"
            icon={Lock}
            placeholder="Enter your password"
          />

          <div className="text-sm text-muted-foreground flex justify-end">
            <button
              type="button"
              onClick={() => onSwitchTab?.(2)}
              className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <SubmitButton title="Sign In" loading={isLoading} />
        </CardContent>
      </ReusableForm>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => onSwitchTab?.(1)}
            className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>
    </motion.div>
  );
}
