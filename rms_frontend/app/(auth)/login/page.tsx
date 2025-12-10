"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/auth-context";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { homePageSettingsApi } from "@/lib/api/ecommerce";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [branding, setBranding] = useState<{ logo_image_url?: string; logo_text?: string }>({});

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const data = await homePageSettingsApi.get();
        setBranding({
          logo_image_url: data.logo_image_url,
          logo_text: data.logo_text,
        });
      } catch (err) {
        console.error("Failed to load branding", err);
      }
    };

    fetchBranding();
  }, []);

  const onSubmit = async (values: FormValues) => {
    try {
      setError(null);
      await login(values);
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="container flex h-screen w-screen items-center justify-center">
      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex items-center justify-center order-2 md:order-1">
          <img
            src="/raw_stitch.JPG"
            alt="Login illustration"
            className="w-full h-auto max-w-lg object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] order-1 md:order-2">
          <div className="flex flex-col space-y-3 text-center items-center">
            {branding.logo_image_url ? (
              <img
                src={branding.logo_image_url}
                alt={branding.logo_text || "Brand logo"}
                className="h-12 w-auto"
              />
            ) : (
              <span className="text-xl font-semibold tracking-tight">
                {branding.logo_text || "Raw Stitch"}
              </span>
            )}
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to sign in
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
