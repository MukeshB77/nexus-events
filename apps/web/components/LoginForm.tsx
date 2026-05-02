"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@repo/validation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"member" | "admin">("member");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginInput) {
    setLoading(true);
    setError(null);

    const supabase = createClient();

    // Attempt login 
    // (Note: Supabase handles roles on backend or via profiles lookup, but we pass the intent just in case, 
    // typically login doesn't need role, but maybe we verify it after fetching profile)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError || !authData.user) {
      setError(authError?.message || "Login failed");
      setLoading(false);
      return;
    }

    // Fetch user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    const isAdmin = profile?.role === 'admin' || authData.user?.user_metadata?.role === 'admin';

    if (isAdmin) {
      window.location.href = "/admin/dashboard";
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="w-full">
      {/* Role Tabs */}
      <Tabs
        defaultValue="member"
        className="w-full mb-8"
        onValueChange={(val) => setRole(val as "member" | "admin")}
      >
        <TabsList className="grid w-full grid-cols-2 p-1 bg-purple-50 border border-purple-100 rounded-xl h-14">
          <TabsTrigger
            value="member"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm text-purple-600/70 text-sm font-semibold transition-all h-full"
          >
            Member
          </TabsTrigger>
          <TabsTrigger
            value="admin"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm text-purple-600/70 text-sm font-semibold transition-all h-full"
          >
            Admin
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-purple-950 capitalize">
          Welcome back, {role}
        </h1>
        <p className="text-purple-600 text-sm font-medium">
          Enter your credentials to continue
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="p-3 text-sm bg-red-50 text-red-600 rounded-lg border border-red-200 font-medium">
              {error}
            </div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-semibold text-purple-900">Email Address</FormLabel>
                <div className="relative group">
                  <div className="absolute left-3 top-3 h-5 w-5 text-purple-400 group-focus-within:text-purple-600 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="example@email.com"
                      className="pl-10 h-12 bg-white border-purple-200 text-purple-900 placeholder:text-purple-300 focus-visible:ring-purple-400 focus-visible:border-purple-400 shadow-sm rounded-xl transition-all"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-semibold text-purple-900">Password</FormLabel>
                <div className="relative group">
                  <div className="absolute left-3 top-3 h-5 w-5 text-purple-400 group-focus-within:text-purple-600 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-12 bg-white border-purple-200 text-purple-900 placeholder:text-purple-300 focus-visible:ring-purple-400 focus-visible:border-purple-400 shadow-sm rounded-xl transition-all"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-5 w-5 text-purple-400 hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-purple-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 rounded" />
              <label
                htmlFor="remember"
                className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-purple-700 cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full h-12 mt-6 text-md font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 rounded-xl transition-all"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#faf5ff] px-4 text-purple-400 tracking-widest font-bold">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-8 text-center text-sm font-medium text-purple-700">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-purple-600 hover:text-purple-800 transition-colors underline-offset-4 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
