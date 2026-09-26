import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an account | Upright Cultivate",
};

export default function SignupPage() {
  return (
    <AuthShell title="Create an account" subtitle="Join Upright Cultivate to start requesting supplies">
      <Suspense fallback={<div className="h-[400px]" />}>
        <SignUpForm />
      </Suspense>
    </AuthShell>
  );
}