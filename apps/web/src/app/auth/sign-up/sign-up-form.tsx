"use client";

import { Label } from "@/components/ui/label";
import { signUpAction } from "./actions";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFormState } from "@/hooks/use-form-state";
import { signInWithGithub } from "../actions";

export function SignUpForm() {
  const [{ errors, message, sucess }, handleSignIn, isPending] =
    useFormState(signUpAction);

  return (
    <div className="space-y-4">
      <form onSubmit={handleSignIn} className="space-y-4">
        {sucess === false && message && (
          <Alert
            variant="destructive"
            className="flex flex-col content-center space-x-2"
          >
            <AlertTriangle className="size-4" />
            <AlertTitle>Sign up failed!</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4">
          <div className="space-y-1">
            <Label htmlFor="firstName">First Name</Label>
            <Input type="text" name="firstName" id="firstName" />

            {errors?.firstName && (
              <p className="text-xs text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="lastName">Last Name</Label>
            <Input type="text" name="lastName" id="lastName" />

            {errors?.lastName && (
              <p className="text-xs text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
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
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirm_password">Confirm your password</Label>
          <Input
            type="password"
            name="confirm_password"
            id="confirm_password"
          />
          {errors?.confirm_password && (
            <p className="text-xs text-red-500">{errors.confirm_password}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Create account"
          )}
        </Button>

        <Button variant="link" className="w-full" size="sm" asChild>
          <Link href="/auth/sign-in">Already registered? Sign in</Link>
        </Button>
      </form>
    </div>
  );
}
