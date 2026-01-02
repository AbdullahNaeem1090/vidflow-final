"use client"

import { Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { loginSchema, TloginFormData } from "@/zod/auth-schema";
import { useAuthStore } from "@/Store/authStore";
import { useRouter } from "next/navigation";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TloginFormData>({
    resolver: zodResolver(loginSchema),
  });
const router=useRouter()
  const { login, isLoggingIn } = useAuthStore();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(login)}>
        <div className="flex flex-col gap-6">
          {/* Logo & Heading */}
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium text-foreground"
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                <Youtube className="size-6 text-foreground" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold text-foreground">
              Welcome to Vidflow
            </h1>
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Sign up
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={"abdullahnaeem2794@gmail.com"}
                className="bg-background text-foreground"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input value={"asd123"} id="password" {...register("password")} type="password" />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

            <Button
            onClick={()=>router.push("/")}
              className="w-full text-background" disabled={isLoggingIn} >
              {isLoggingIn ? "Logging In ..." : "Login"}
            </Button>
          </div>

          

          {/* Social Login */}
          
        </div>
      </form>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground text-balance *:[a]:text-primary *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary/80">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
