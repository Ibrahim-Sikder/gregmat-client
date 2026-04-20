import z from "zod";

const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long." })
  .nonempty({ message: "Password is required." })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character.",
  });

const confirmPasswordSchema = z
  .string()
  .nonempty({ message: "Please confirm your password" });

export const signInSchema = z.object({
  email: z.string({ message: "Please enter a valid email address" }).email(),
  password: passwordSchema,
});

export const signUpSchema = z
  .object({
    username: z.string({ message: "Provide you username" }),
    email: z.string({ message: "Please enter a valid email address" }).email(),
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotSchema = z.object({
  email: z.string({ message: "Please enter a valid email address" }).email(),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
