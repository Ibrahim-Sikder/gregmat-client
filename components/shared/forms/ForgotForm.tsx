import { CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { FieldValues } from "react-hook-form";
import SubmitButton from "../button/SubmitButton";
import TextInput from "../inputs/TextInput";
import { ReusableForm } from "./ReusableForm";
import { forgotSchema } from "./validations/auth";
import { useForgotPasswordMutation } from "@/redux/features/auth/auth.api";
import { toast } from "sonner";

type ForgotFormProps = {
  onSwitchTab: (tabIndex: number) => void;
};

export default function ForgotForm({ onSwitchTab }: ForgotFormProps) {
  const [forgotPass, { isLoading, isSuccess }] = useForgotPasswordMutation();

  async function onSubmit(data: FieldValues) {
    try {
      const result = await forgotPass({ email: data.email }).unwrap();
      if (result.message) {
        toast.success(result.message || "Reset link sent to your email");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to send reset link. Please try again.",
      );
    }
  }

  const defaultValues = {
    email: "bablu22@gmail.com",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <ReusableForm onSubmit={onSubmit} resolver={zodResolver(forgotSchema)}>
        {isSuccess && (
          <div
            className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg"
            role="alert"
          >
            Please check your email for the reset link.
          </div>
        )}
        <CardContent className="space-y-4">
          <TextInput
            label="Email Address"
            name="email"
            type="email"
            icon={Mail}
            placeholder="Enter your email"
          />

          <SubmitButton title="Send Reset Link" loading={isLoading} />
        </CardContent>
      </ReusableForm>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Remember your password?{" "}
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
