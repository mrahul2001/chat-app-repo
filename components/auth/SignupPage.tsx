"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/utils/supabase-client";
import { PeriskopeIcon } from "@/utils/Icons";
import { validatePhone, validateEmail, validateUsername, validatePassword, generateRandomPhone } from "@/utils/validationUtils";

export const SignupPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const supabase = createBrowserSupabaseClient();

  
  // Function to generate a UI Avatar URL from username
  const generateUIAvatarUrl = (username: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!validateUsername(username)) {
      setError("Username must be between 3 and 30 characters");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (!validatePhone(phone)) {
      setError("Please enter a valid phone number (10-15 digits)");
      setLoading(false);
      return;
    }

    try {
      const { data: existingUsers, error: phoneCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', phone);
        
      if (phoneCheckError) {
        console.error("Error checking phone uniqueness:", phoneCheckError);
      } else if (existingUsers && existingUsers.length > 0) {
        setError("This phone number is already in use. Please use a different one.");
        setLoading(false);
        return;
      }
      
      // Use UI Avatar if no avatar URL is provided
      const finalAvatarUrl = avatarUrl.trim() ? avatarUrl : generateUIAvatarUrl(username);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            avatar_url: finalAvatarUrl,
            phone,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        if (authData.session) {
          setSuccess("Account created successfully! Redirecting to app...");
          await new Promise(resolve => setTimeout(resolve, 2000));
          router.push("/");
        } else {
          setSuccess("Account created! Please check your email for confirmation before signing in.");
          await new Promise(resolve => setTimeout(resolve, 3000));
          router.push("/auth/signin");
        }
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during sign up");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-4 sm:p-8 space-y-6 sm:space-y-8 bg-white rounded-lg shadow-md overflow-y-auto max-h-screen sm:max-h-none">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <PeriskopeIcon className="h-16 sm:h-20 w-16 sm:w-20" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-green-700">Create an Account</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">Join Periskope and start chatting</p>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 bg-green-50 text-green-600 rounded-md text-sm">
          {success}
        </div>
      )}
      
      <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSignUp}>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
            autoComplete="username"
          />
        </div>
        
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
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+1 555-123-4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
            autoComplete="tel"
          />
          <div className="flex justify-between items-center mt-1 flex-wrap">
            <p className="text-xs text-gray-500 mr-2">
              Format: +1 555-123-4567
            </p>
            <button 
              type="button"
              onClick={() => setPhone(generateRandomPhone())}
              className="text-xs text-green-600 hover:text-green-500"
            >
              Generate Random
            </button>
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
            autoComplete="new-password"
          />
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 6 characters long
          </p>
        </div>
        
        <div>
          <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700">
            Avatar URL (optional)
          </label>
          <input
            id="avatarUrl"
            name="avatarUrl"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
            autoComplete="off"
            placeholder="https://avatars.githubusercontent.com/yourusername"
          />
          <div className="mt-1 text-xs text-gray-500">
            <p>Only GitHub avatar URLs are supported (e.g., https://avatars.githubusercontent.com/yourusername)</p>
            <p className="mt-0.5">If left empty, an avatar will be automatically generated from your username</p>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </div>
      </form>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-medium text-green-600 hover:text-green-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}; 