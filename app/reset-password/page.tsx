import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Upright Cultivate",
};

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Reset Password" subtitle="Choose a new password for your account">
      <Suspense fallback={<div className="h-[300px]" />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
