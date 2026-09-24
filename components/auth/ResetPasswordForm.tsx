"use client";

import { useActionState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordAction } from "@/actions/auth-password";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";

  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    { success: false, message: "" }
  );

  useEffect(() => {
    if (state.success) {
      // Small delay so user can read the success message before redirect
      const timeout = setTimeout(() => {
        router.push("/signin");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [state.success, router]);

  if (!email || !otp) {
    return (
      <Alert variant="error">
        Missing reset information. Please start the password reset process again.
      </Alert>
    );
  }

  if (state.success) {
    return (
      <Alert variant="success">
        {state.message} Redirecting to sign in...
      </Alert>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="otp" value={otp} />
      
      {state.message && (
        <Alert variant="error">{state.message}</Alert>
      )}

      <FormField 
        label="New Password"
        description="Must be at least 8 characters long."
        error={state.fieldErrors?.password?.[0]}
      >
        {({ id, "aria-describedby": ariaDescribedBy, error }) => (
          <Input
            id={id}
            name="password"
            type="password"
            autoComplete="new-password"
            required
            aria-describedby={ariaDescribedBy}
            error={error}
          />
        )}
      </FormField>

      <FormField 
        label="Confirm New Password"
        error={state.fieldErrors?.passwordConfirmation?.[0]}
      >
        {({ id, "aria-describedby": ariaDescribedBy, error }) => (
          <Input
            id={id}
            name="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            required
            aria-describedby={ariaDescribedBy}
            error={error}
          />
        )}
      </FormField>

      <Button type="submit" className="w-full" isLoading={pending}>
        Reset Password
      </Button>
    </form>
  );
}
