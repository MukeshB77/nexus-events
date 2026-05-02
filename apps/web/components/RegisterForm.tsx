"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@repo/validation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Eye, EyeOff, Loader2, User } from "lucide-react";

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "member",
    },
  });

  const selectedRole = form.watch("role");

  async function onSubmit(data: RegisterInput) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    
    // Register the user
    // The role will be captured by our Postgres Trigger to create a profile automatically!
    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.name,
          role: data.role,
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    
    // Typically after successful signup you either redirect to dashboard (if auto-login works) 
    // or tell user to confirm email.
    // For this flow, we will auto redirect to dashboard.
    setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
    }, 1000);
  }

  if (success) {
      return (
          <div className="w-full text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                 <Mail className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold">Successfully registered!</h2>
              <p className="text-muted-foreground">Redirecting to dashboard...</p>
          </div>
      )
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-purple-950 capitalize">
          Create an account
        </h1>
        <p className="text-purple-600 text-sm font-medium">
          Enter your details to register as a {selectedRole}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          
          <Tabs 
            value={selectedRole} 
            className="w-full mb-6"
            onValueChange={(val) => form.setValue("role", val as "member" | "admin")}
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

          {error && (
            <div className="p-3 text-sm bg-red-50 text-red-600 rounded-lg border border-red-200 font-medium">
              {error}
            </div>
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-semibold text-purple-900">Full Name</FormLabel>
                <div className="relative group">
                  <div className="absolute left-3 top-3 h-5 w-5 text-purple-400 group-focus-within:text-purple-600 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="Jane Doe" 
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
                      placeholder="Create a password" 
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

          <Button 
            type="submit" 
            className="w-full h-12 mt-6 text-md font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 rounded-xl transition-all"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing up...
              </>
            ) : (
              "Sign Up"
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
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-purple-600 hover:text-purple-800 transition-colors underline-offset-4 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
