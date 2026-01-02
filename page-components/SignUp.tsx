import { Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type TsignUpFormData } from "@/zod/auth-schema";
import { useAuthStore } from "@/Store/authStore";
import Link from "next/link";

export default function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signup, isSigningUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TsignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(signup)}>
        <div className="flex flex-col gap-6">
          {/* Logo & Heading */}
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="text-foreground flex flex-col items-center gap-2 font-medium"
            >
              <div className="bg-muted flex size-8 items-center justify-center rounded-md">
                <Youtube className="size-6" />
              </div>
              <span className="sr-only">Insta Inc.</span>
            </a>
            <h1 className="text-foreground text-xl font-bold">
              Create your account
            </h1>
            <div className="text-muted-foreground text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 underline underline-offset-4"
              >
                Log in
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name" className="text-foreground">
                Username
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                className="bg-background text-foreground"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-background text-foreground"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="bg-background text-foreground"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="text-background w-full">
              {isSigningUp ? "Signing Up ..." : "Sign Up"}
            </Button>
          </div>

    

          {/* Social Sign Up */}
         
        </div>
      </form>

      {/* Footer */}
      <div className="text-muted-foreground *:[a]:text-primary *:[a]:hover:text-primary/80 text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By signing up, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
