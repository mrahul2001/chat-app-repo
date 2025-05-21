"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/utils/supabase-client";
import { PeriskopeIcon } from "@/utils/Icons";
import { validateEmail } from "@/utils/validationUtils";

export const SigninPage = () => {
  const router = useRouter();
    const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createBrowserSupabaseClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({email, password,});

      if (error) throw error;

      router.push("/");
      router.refresh();
    } catch (error: any) {
      setError(error.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-4 sm:p-8 space-y-6 sm:space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <PeriskopeIcon className="h-16 sm:h-20 w-16 sm:w-20" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-green-700">Welcome Back</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">Sign in to your Periskope account</p>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSignIn}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
            autoComplete="email"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link href="/auth/forgot-password" className="text-xs font-medium text-green-600 hover:text-green-500">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
            autoComplete="current-password"
          />
        </div>
        
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="font-medium text-green-600 hover:text-green-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}; 