"use client";

import { Label } from "@/components/ui/label";
import { signInWithPasswordAction } from "./actions";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFormState } from "@/hooks/use-form-state";

export function SignInForm() {
  const [{ errors, message, sucess }, handleSignIn, isPending] = useFormState(
    signInWithPasswordAction
  );

  return (
    <div className="space-y-4">
      <form onSubmit={handleSignIn} className="space-y-4">
        {sucess === false && message && (
          <Alert
            variant="destructive"
            className="flex flex-col content-center space-x-2"
          >
            <AlertTriangle className="size-4" />
            <AlertTitle>Sign in failed!</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-1">
          <Label htmlFor="emailOrUsername">E-mail</Label>
          <Input type="email" name="email" id="email" />

          {errors?.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" id="password" />
          {errors?.password && (
            <p className="text-xs text-red-500">{errors.password}</p>
          )}
          <Link
            href="/auth/forgot-password"
            className="text-xs font-medium text-foreground hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
        </Button>

        <Button variant="link" className="w-full" size="sm" asChild>
          <Link href="/auth/sign-up">Create new account</Link>
        </Button>
      </form>
    </div>
  );
}
