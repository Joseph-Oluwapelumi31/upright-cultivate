"use client";

import { useActionState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signUpAction } from "@/actions/auth";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || searchParams.get("callbackUrl") || "/dashboard";

  const [state, formAction, pending] = useActionState(
    signUpAction,
    { success: false, message: "" }
  );

  useEffect(() => {
    if (state.success) {
      router.push(state.message);
    }
  }, [state.success, state.message, router]);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="next" value={nextUrl} />
      {!state.success && state.message && (
        <Alert variant="error">{state.message}</Alert>
      )}

      <FormField 
        label="Full Name"
        error={state.fieldErrors?.name?.[0]}
      >
        {({ id, "aria-describedby": ariaDescribedBy, error }) => (
          <Input
            id={id}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-describedby={ariaDescribedBy}
            error={error}
          />
        )}
      </FormField>

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

      <FormField 
        label="Password"
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
        label="Confirm Password"
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
        Create account
      </Button>

      <div className="text-center text-small text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link href={`/signin?next=${encodeURIComponent(nextUrl)}`} className="font-medium text-primary hover:text-primary/80">
          Sign in
        </Link>
      </div>
    </form>
  );
}
