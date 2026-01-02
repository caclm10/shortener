import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Credenza,
    CredenzaBody,
    CredenzaClose,
    CredenzaContent,
    CredenzaDescription,
    CredenzaFooter,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from "@/components/ui/credenza";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createLink } from "@/lib/links";

const linkSchema = z.object({
    original_url: z.string().url("Please enter a valid URL"),
    alias: z
        .string()
        .regex(
            /^[a-zA-Z0-9-_]*$/,
            "Only letters, numbers, hyphens, and underscores allowed",
        )
        .optional()
        .or(z.literal("")),
});

type LinkFormData = z.infer<typeof linkSchema>;

interface LinkCreateFormProps {
    trigger: React.ReactNode;
    onSuccess?: (link: LinkTable) => void;
}

function LinkCreateForm({ trigger, onSuccess }: LinkCreateFormProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LinkFormData>({
        resolver: zodResolver(linkSchema),
        defaultValues: {
            original_url: "",
            alias: "",
        },
    });

    const originalUrlId = useId();
    const aliasId = useId();

    async function onSubmit(data: LinkFormData) {
        setIsLoading(true);

        try {
            const newLink = await createLink({
                original_url: data.original_url,
                alias: data.alias || undefined,
            });

            toast.success("Link created successfully!");
            onSuccess?.(newLink);
            setOpen(false);
            form.reset();
        } catch (error) {
            if (error instanceof Error) {
                // Check for unique constraint violation
                if (
                    error.message.includes("duplicate") ||
                    error.message.includes("unique")
                ) {
                    toast.error(
                        "This alias is already taken. Please choose another.",
                    );
                } else {
                    toast.error(error.message);
                }
            } else {
                toast.error("Failed to create link. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Credenza open={open} onOpenChange={setOpen}>
            <CredenzaTrigger asChild>{trigger}</CredenzaTrigger>
            <CredenzaContent>
                <CredenzaHeader>
                    <CredenzaTitle>Create Short Link</CredenzaTitle>
                    <CredenzaDescription>
                        Enter the URL you want to shorten. Leave alias empty for
                        auto-generation.
                    </CredenzaDescription>
                </CredenzaHeader>
                <CredenzaBody>
                    <form
                        id="link-create-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FieldGroup>
                            <Controller
                                name="original_url"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={originalUrlId}>
                                            Original URL
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={originalUrlId}
                                            type="url"
                                            placeholder="https://example.com/very-long-url"
                                            aria-invalid={fieldState.invalid}
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
                                name="alias"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={aliasId}>
                                            Custom Alias (optional)
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={aliasId}
                                            type="text"
                                            placeholder="my-custom-link"
                                            aria-invalid={fieldState.invalid}
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
                        </FieldGroup>
                    </form>
                </CredenzaBody>
                <CredenzaFooter>
                    <CredenzaClose asChild>
                        <Button variant="outline" disabled={isLoading}>
                            Cancel
                        </Button>
                    </CredenzaClose>
                    <Button
                        type="submit"
                        form="link-create-form"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating..." : "Create Link"}
                    </Button>
                </CredenzaFooter>
            </CredenzaContent>
        </Credenza>
    );
}

export { LinkCreateForm };
