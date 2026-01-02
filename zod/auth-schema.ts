import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z.object({
  username: z.string().min(3, "name is too short"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .refine(
      (email) => {
        const domain = email.split("@")[1]?.toLowerCase().trim();
        return "gmail.com" === domain;
      },
      {
        message: "Only Gmail is supported",
      }
    ),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


 const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Only letters, numbers, . _ - are allowed"),
  // currentPassword required only when changing password; we'll validate in component
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .optional(),
  confirmPassword: z.string().optional(),
});

// helper for matching confirm password (we'll check in form resolver)
export type ProfileFormValues = z.infer<typeof profileSchema>;
export type TloginFormData = z.infer<typeof loginSchema>;
export type TsignUpFormData = z.infer<typeof signUpSchema>;

export { loginSchema, signUpSchema,profileSchema };
