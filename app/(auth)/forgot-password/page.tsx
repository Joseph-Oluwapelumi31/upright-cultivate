import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Upright Cultivate",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Forgot Password" subtitle="Enter your email to receive a password reset code">
      <Suspense fallback={<div className="h-[200px]" />}>
        <ForgotPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
