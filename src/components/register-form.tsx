"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters.")
            .max(50, "Name must be at most 50 characters."),
        email: z.email("Please enter a valid email address."),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters.")
            .max(72, "Password must be at most 72 characters."),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const nameInputId = useId();
    const emailInputId = useId();
    const passwordInputId = useId();
    const confirmPasswordInputId = useId();

    async function onSubmit(data: RegisterFormData) {
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.name,
                    },
                },
            });

            if (error) {
                toast.error(error.message);
                return;
            }

            toast.success("Registration successful! Welcome aboard.");
            navigate("/dashboard");
        } catch {
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card {...props}>
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your information below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={nameInputId}>
                                        Full Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={nameInputId}
                                        type="text"
                                        placeholder="John Doe"
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="name"
                                        disabled={isLoading}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={emailInputId}>
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={emailInputId}
                                        type="email"
                                        placeholder="m@example.com"
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="email"
                                        disabled={isLoading}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={passwordInputId}>
                                        Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={passwordInputId}
                                        type="password"
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="confirmPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel
                                        htmlFor={confirmPasswordInputId}
                                    >
                                        Confirm Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={confirmPasswordInputId}
                                        type="password"
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        <Field>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading
                                    ? "Creating account..."
                                    : "Create Account"}
                            </Button>

                            <FieldDescription className="px-6 text-center">
                                Already have an account?{" "}
                                <Link to="/login">Login</Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}

export { RegisterForm };
