import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const returnTo = searchParams.get("return_to");

    if (returnTo && returnTo.startsWith("https://")) {
      // Preserve the hash fragment (contains tokens) and redirect back
      const hash = window.location.hash;
      window.location.replace(`${returnTo}${hash}`);
    } else {
      // No return_to or invalid — just go home
      window.location.replace("/");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Redirecting…</p>
    </div>
  );
}
