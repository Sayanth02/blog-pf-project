"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { signUpApi } from "@/services/AuthService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function SignupForm() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signUpApi(form);

      toast.success(`Signup successful! Welcome ${res.username}` ,{
        position: "top-center"
      });
      // Notify listeners (e.g., Navbar) that auth state changed
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-changed"));
      }
      // Navigate to home and refresh to revalidate any server components
      router.push("/");
      router.refresh();
    } catch (error:any) {
      toast.error(`Signup failed: ${error}`, {
        position: "top-center",
      });
    }
  };

  return (
    <Card className="w-full max-w-md ">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="username"
            placeholder="Full Name"
            value={form.username}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
          <div className="space-y-4 w-full">
            <a
              href="/api/auth/google"
              className="inline-flex items-center gap-2 rounded-md border px-4 py-2 w-full"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
                <path d="M44.5 20H24v8.5h11.8C34.8 32.9 30.1 36 24 36c-6.6 0-12.2-4.3-14.2-10.1S9 13 15 10.1s13.1-1 17.2 3l6-6C34.1 1.8 29.3 0 24 0 10.7 0 .5 10.3.5 23.5S10.7 47 24 47s23.5-10.3 23.5-23.5c0-1.7-.2-3.3-.6-4.9z"></path>
              </svg>
              Continue with Google
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
