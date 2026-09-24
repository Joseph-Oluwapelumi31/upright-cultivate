"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { forgotPasswordAction } from "@/actions/auth-password";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function ForgotPasswordForm() {
  const router = useRouter();
  
  const [state, formAction, pending] = useActionState(
    forgotPasswordAction,
    { success: false, message: "" }
  );

  useEffect(() => {
    if (state.success) {
      // The form uses FormData, so we need to get the email that was submitted.
      // But we don't have it easily here unless we track it or read it from the DOM.
      // Easiest is to let a form submit handler do it or just grab it from a ref.
    }
  }, [state.success]);

  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSubmit = (formData: FormData) => {
    const email = formData.get("email") as string;
    setSubmittedEmail(email);
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="space-y-6" id="forgot-password-form">
      {state.message && (
        <Alert variant={state.success ? "success" : "error"}>{state.message}</Alert>
      )}

      {!state.success && (
        <>
          <FormField 
            label="Email address"
            error={state.fieldErrors?.email?.[0]}
          >
            {({ id, "aria-describedby": ariaDescribedBy, error }) => (
              <Input
                id={id}
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-describedby={ariaDescribedBy}
                error={error}
              />
            )}
          </FormField>

          <Button type="submit" className="w-full" isLoading={pending}>
            Send reset code
          </Button>
        </>
      )}

      {state.success && (
        <Button 
          type="button" 
          variant="primary" 
          className="w-full"
          onClick={() => {
            router.push(`/verify-otp?email=${encodeURIComponent(submittedEmail)}&purpose=PASSWORD_RESET`);
          }}
        >
          Enter verification code
        </Button>
      )}

      <div className="text-center text-small text-muted-foreground mt-6">
        Remember your password?{" "}
        <Link href="/signin" className="font-medium text-primary hover:text-primary/80">
          Sign in
        </Link>
      </div>
    </form>
  );
}
