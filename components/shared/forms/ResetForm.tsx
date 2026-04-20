"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { resetPasswordSchema } from "./validations/auth";
import { ReusableForm } from "./ReusableForm";
import TextInput from "../inputs/TextInput";
import { FieldValues } from "react-hook-form";
import SubmitButton from "../button/SubmitButton";
import Link from "next/link";
import { useResetPasswordMutation } from "@/redux/features/auth/auth.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RestPassProps {
  token: string;
}

export default function ResetForm({ token }: RestPassProps) {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigation = useRouter();

  async function onSubmit(data: FieldValues) {
    try {
      const res = await resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      if (res?.message) {
        toast.success(res?.message || "Password successfully updated.");
        navigation.push("/auth");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  }

  const defaultValues = {
    password: "",
    confirmPassword: "",
  };

  return (
    <section className="flex items-center justify-center py-12">
      <div className="w-full max-w-md px-4">
        <Card className="border border-gray-100 bg-gradient-to-br from-white to-gray-50 rounded-2xl">
          {/* Header */}
          <CardHeader className="text-center space-y-2 py-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Reset Password
            </CardTitle>
            <CardDescription className="text-gray-500">
              Enter and confirm your new password below
            </CardDescription>
          </CardHeader>

          {/* Form */}
          <ReusableForm
            onSubmit={onSubmit}
            resolver={zodResolver(resetPasswordSchema)}
            defaultValues={defaultValues}
          >
            <CardContent className="space-y-5">
              <TextInput
                label="New Password"
                name="password"
                type="password"
                icon={Lock}
                placeholder="Enter a strong password"
              />

              <TextInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                icon={Lock}
                placeholder="Re-enter your password"
              />

              <SubmitButton title="Update Password" loading={isLoading} />
            </CardContent>

            {/* Footer */}
            <CardFooter className="flex justify-center items-center pt-2">
              <span className="text-sm text-gray-500">
                Remembered your password?{" "}
                <Link href="/auth">
                  <button
                    type="button"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Sign In
                  </button>
                </Link>
              </span>
            </CardFooter>
          </ReusableForm>
        </Card>
      </div>
    </section>
  );
}
