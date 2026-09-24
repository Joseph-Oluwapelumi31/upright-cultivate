import { ReactNode } from "react";
import AuthHeader from "@/components/auth/AuthHeader";

export default function AuthShell({ children, title, subtitle }: { children: ReactNode, title?: string, subtitle?: string }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AuthHeader />
      <main className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {title && <h2 className="text-center font-display text-h3 text-foreground">{title}</h2>}
          {subtitle && <p className="mt-2 text-center text-small text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-surface sm:rounded-card sm:border sm:border-border px-4 py-8 sm:px-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
