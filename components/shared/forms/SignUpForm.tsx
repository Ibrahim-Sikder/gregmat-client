import { CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Lock, Mail, User } from "lucide-react";
import { FieldValues, useFormContext } from "react-hook-form";
import SubmitButton from "../button/SubmitButton";
import TextInput from "../inputs/TextInput";
import { ReusableForm } from "./ReusableForm";
import { signUpSchema } from "./validations/auth";
import { useSignUpMutation } from "@/redux/features/auth/auth.api";
import { toast } from "sonner";

type SignUpFormProps = {
  onSwitchTab: (tabIndex: number) => void;
};

export default function SignUpForm({ onSwitchTab }: SignUpFormProps) {
  const [singUp, { isLoading, isSuccess }] = useSignUpMutation();

  async function onSubmit(data: FieldValues) {
    try {
      const res = await singUp(data).unwrap();
      if (res?.message) {
        toast.success(res?.message || "Account created successfully");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to create account. Please try again.",
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
      <ReusableForm onSubmit={onSubmit} resolver={zodResolver(signUpSchema)}>
        {isSuccess && (
          <div
            className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg"
            role="alert"
          >
            Please check your email to verify your account.
          </div>
        )}

        <CardContent className="space-y-4">
          <TextInput
            label="Username"
            name="username"
            type="text"
            icon={User}
            placeholder="Enter your username"
          />
          <TextInput
            label="Email Address"
            name="email"
            type="email"
            icon={Mail}
            placeholder="Enter your email"
          />
          <TextInput
            label="Password"
            name="password"
            type="password"
            icon={Lock}
            placeholder="Enter your password"
          />

          <TextInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            icon={Lock}
            placeholder="Re-enter your password"
          />

          <SubmitButton title="Create Account" loading={isLoading} />
        </CardContent>
      </ReusableForm>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onSwitchTab(0)}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </motion.div>
  );
}
