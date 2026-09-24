import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import VerifyOtpForm from "@/components/auth/VerifyOtpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Code | Upright Cultivate",
};

export default function VerifyOtpPage() {
  return (
    <AuthShell title="Verify Code" subtitle="Check your email for the verification code">
      <Suspense fallback={<div className="h-[200px]" />}>
        <VerifyOtpForm />
      </Suspense>
    </AuthShell>
  );
}
