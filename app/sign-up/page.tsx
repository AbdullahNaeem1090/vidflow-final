"use client"

import SignUpForm from "@/page-components/SignUp";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SignUpPage() {
  useEffect(()=>{
        toast.info("This page is only for front End (ui) prupose")

  },[])
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm" >
        <SignUpForm />
      </div>
    </div>
  );
}
