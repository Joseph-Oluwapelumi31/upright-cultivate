"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleCredentialsSignin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
  
    setError("");
    setIsLoading(true);
  
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  
    setIsLoading(false);
  
    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }
  
    router.push("/customer/dashboard");
  }

  async function handleGoogleSignin() {
    setError("");

    await signIn("google", {
      callbackUrl: "/customer/dashboard",
    });
  }

  return (
    <main>
      <h1>Sign in</h1>

      <form onSubmit={handleCredentialsSignin}>
        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <hr />

      <button type="button" onClick={handleGoogleSignin}>
        Continue with Google
      </button>
    </main>
  );
}