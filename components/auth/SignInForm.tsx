"use client";

import { useActionState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signInAction, signInWithGoogleAction } from "@/actions/auth";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import GoogleIcon from "@/components/icons/GoogleIcon";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || searchParams.get("callbackUrl") || "/dashboard";

  const [state, formAction, pending] = useActionState(
    signInAction,
    { success: false, message: "" }
  );

  useEffect(() => {
    if (state.success) {
      router.push(state.message);
    }
  }, [state.success, state.message, router]);

  const oauthError = searchParams.get("error");
  let oauthErrorMessage = "";
  if (oauthError === "AccessDenied") {
    oauthErrorMessage = "Google sign-in was cancelled.";
  } else if (oauthError === "Configuration") {
    oauthErrorMessage = "There is a problem with the server configuration.";
  } else if (oauthError) {
    oauthErrorMessage = "An error occurred during sign in. Please try again.";
  }

  return (
    <>
      <form action={formAction} className="space-y-6">
      <input type="hidden" name="next" value={nextUrl} />
      
      {oauthErrorMessage && (
        <Alert variant="error">{oauthErrorMessage}</Alert>
      )}

      {!state.success && state.message && !oauthErrorMessage && (
        <Alert variant="error">{state.message}</Alert>
      )}

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
        error={state.fieldErrors?.password?.[0]}
      >
        {({ id, "aria-describedby": ariaDescribedBy, error }) => (
          <div>
            <Input
              id={id}
              name="password"
              type="password"
              autoComplete="current-password"
              required
              aria-describedby={ariaDescribedBy}
              error={error}
            />
            <div className="mt-2 flex justify-end">
              <Link href="/forgot-password" className="text-small font-medium text-primary hover:text-primary/80">
                Forgot password?
              </Link>
            </div>
          </div>
        )}
      </FormField>

      <Button type="submit" className="w-full" isLoading={pending}>
        Sign in
      </Button>
    </form>

    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-small uppercase">
        <span className="bg-surface px-2 text-muted-foreground">OR</span>
      </div>
    </div>

    <form action={signInWithGoogleAction} className="space-y-6">
      <input type="hidden" name="next" value={nextUrl} />
      <Button type="submit" variant="secondary" className="w-full">
        <GoogleIcon className="size-5" />
        Continue with Google
      </Button>
    </form>

    <div className="text-center text-small text-muted-foreground mt-6">
        Don&apos;t have an account?{" "}
        <Link href={`/signup?next=${encodeURIComponent(nextUrl)}`} className="font-medium text-primary hover:text-primary/80">
          Sign up
        </Link>
      </div>
    </>
  );
}
