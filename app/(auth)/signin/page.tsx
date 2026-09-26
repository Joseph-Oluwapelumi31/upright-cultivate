import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | Upright Cultivate",
};

export default function SigninPage() {
  return (
    <AuthShell title="Sign in" subtitle="Welcome back to Upright Cultivate">
      <Suspense fallback={<div className="h-[300px]" />}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}