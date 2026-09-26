"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtpAction, forgotPasswordAction } from "@/actions/auth-password";
import { verifySignupOtpAction, resendSignupVerificationAction, type AuthState } from "@/actions/auth";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const purpose = searchParams.get("purpose") || "PASSWORD_RESET";
  const nextUrl = searchParams.get("next");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  const [state, formAction, pending] = useActionState(
    async (prevState: AuthState, formData: FormData) => {
      if (purpose === "EMAIL_VERIFICATION") {
        return await verifySignupOtpAction(prevState, formData);
      }
      return await verifyOtpAction(prevState, formData);
    },
    { success: false, message: "" }
  );

  useEffect(() => {
    if (state.success && email) {
      if (purpose === "PASSWORD_RESET") {
        router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
      } else {
        router.push(nextUrl ? `/signin?next=${encodeURIComponent(nextUrl)}` : "/signin");
      }
    }
  }, [state.success, email, otp, router, purpose, nextUrl]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = () => {
    if (countdown > 0 || isResending) return;
    
    setIsResending(true);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);
      
      if (purpose === "EMAIL_VERIFICATION") {
        await resendSignupVerificationAction({ success: false, message: "" }, formData);
      } else {
        await forgotPasswordAction({ success: false, message: "" }, formData);
      }
      
      setCountdown(60);
      setIsResending(false);
    });
  };

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="purpose" value={purpose} />
      
      {!state.success && state.message && (
        <Alert variant="error">{state.message}</Alert>
      )}

      <div className="text-small text-muted-foreground mb-4">
        We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>.
      </div>

      <FormField 
        label="Verification Code"
        error={state.fieldErrors?.otp?.[0]}
      >
        {({ id, "aria-describedby": ariaDescribedBy, error }) => (
          <Input
            id={id}
            name="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            autoComplete="one-time-code"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            aria-describedby={ariaDescribedBy}
            error={error}
          />
        )}
      </FormField>

      <Button type="submit" className="w-full" isLoading={pending} disabled={otp.length !== 6}>
        Verify code
      </Button>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || isResending}
          className="text-small font-medium text-primary disabled:text-muted-foreground disabled:cursor-not-allowed hover:text-primary/80 transition-colors"
        >
          {countdown > 0 ? `Resend code in ${countdown}s` : (isResending ? "Resending..." : "Resend code")}
        </button>
      </div>
    </form>
  );
}
