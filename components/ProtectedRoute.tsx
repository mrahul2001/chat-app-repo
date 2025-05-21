"use client";

import { useAuth } from "@/utils/AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip this check for auth pages
    if (pathname.startsWith("/auth/") || loading) {
      return;
    }

    if (!user && !loading) {
      router.push("/auth/signin");
    }
  }, [user, loading, router, pathname]);

  // Don't render anything while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  // Allow rendering on auth pages regardless of authentication status
  if (pathname.startsWith("/auth/")) {
    return <>{children}</>;
  }

  // Only render children if user is authenticated
  return user ? <>{children}</> : null;
};

export default ProtectedRoute; 