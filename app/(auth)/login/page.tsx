"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { mockAuthService } from "@/lib/services/auth/mock-auth.service";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await mockAuthService.login();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
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
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Signing in...
              </>
            ) : (
              <>
                <span>🔗</span>
                Sign in with LinkedIn (Mock)
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Note: This is a mock authentication for the UI prototype.
            Real LinkedIn OAuth will be implemented in Phase 2.
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
