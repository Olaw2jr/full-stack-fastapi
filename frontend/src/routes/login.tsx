import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod";
import { buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel
} from "@/components/ui/form"
import { Eye , EyeOff, ChevronLeft, LoaderCircle } from "lucide-react"

import {
  Link,
  createFileRoute,
  redirect,
} from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"

import Logo from "../assets/images/fastapi-logo.svg"
import type { Body_login_login_access_token as AccessToken } from "../client"
import useAuth, { isLoggedIn } from "../hooks/useAuth"
import { signInSchema } from "@/utils"

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { loginMutation, resetError } = useAuth()
  
  const form = useForm<AccessToken>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<AccessToken> = async (data) => {
    if (form.formState.isSubmitting) return

    resetError()

    try {
      await loginMutation.mutateAsync(data)
    } catch {
      // error is handled by useAuth hook
    }
  }


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Link
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute left-4 top-4 md:left-8 md:top-8"
          )}
        >
          <ChevronLeft />
          Back
        </Link>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <img
              src={Logo}
              alt="FastAPI logo"
              className="h-auto, max-w-48, mb-4, self-center"
            />
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to sign in to your account
            </p>
          </div>
          <div className="max-w-96 items-stretch justify-center gap-4 content-center">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormControl>
                        <Input
                          className="w-full"
                          id="username"
                          type="email"
                          placeholder="john.doe@example.com"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          disabled={form.formState.isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mb-6 relative">
                      <FormControl>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          className="w-full"
                          placeholder="Password"
                          autoComplete="off"
                          disabled={form.formState.isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <Button
                        variant="link"
                        className="absolute top-0 right-0 bottom-2"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex justify-between mb-7">
                      <div className="flex items-center space-x-3">
                        <FormControl>
                          <Checkbox
                            id="remember"
                            disabled={form.formState.isSubmitting}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel htmlFor="remember">Remember me</FormLabel>
                      </div>
                      <div>
                        <Link to="/recover-password" color="blue.500">
                          Forgot password?
                        </Link>
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className={cn(buttonVariants(), "w-full")}
                  aria-disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && (
                    <LoaderCircle className="mr-3 -ml-1 h-5 w-5 animate-spin text-white" />
                  )}
                  Sign In
                </Button>
              </form>
            </Form>
          </div>
          <p className={`text-center text-base font-medium pt-7`}>
            {"Don’t have an account?"} {""}
            <Link to="/recover-password" className="font-semibold">
              {"Create account"}
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
