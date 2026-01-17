"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { authService } from "@/lib/services/auth/auth.service";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for error in URL params (from OAuth callback)
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleLinkedInLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await authService.signInWithLinkedIn();
      
      if (error) {
        setError(error.message || "Failed to initiate LinkedIn login");
        setIsLoading(false);
      }
      // If successful, user will be redirected to LinkedIn OAuth
      // Then redirected back to /auth/callback
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle>Sign in to Opportunity.ai</CardTitle>
          <CardDescription>
            Connect with LinkedIn to get started with your job search journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <Button
            onClick={handleLinkedInLogin}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Redirecting to LinkedIn...
              </>
            ) : (
              <>
                <span>🔗</span>
                Sign in with LinkedIn
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
            We use LinkedIn OAuth for secure authentication.
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <AuthLayout>
        <Card>
          <CardHeader>
            <CardTitle>Sign in to Opportunity.ai</CardTitle>
            <CardDescription>
              Connect with LinkedIn to get started with your job search journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8">
              <span className="animate-spin">⏳</span>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    }>
      <LoginForm />
    </Suspense>
  );
}
