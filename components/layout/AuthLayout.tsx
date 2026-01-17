export function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 p-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Opportunity.ai</h1>
          <p className="text-muted-foreground">
            AI-assisted job search and application management
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
