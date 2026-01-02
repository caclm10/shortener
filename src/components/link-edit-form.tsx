import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId, useState } from "react";
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
} from "@/components/ui/credenza";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateLink } from "@/lib/links";

const linkSchema = z.object({
    original_url: z.string().url("Please enter a valid URL"),
    alias: z
        .string()
        .min(1, "Alias is required")
        .regex(
            /^[a-zA-Z0-9-_]+$/,
            "Only letters, numbers, hyphens, and underscores allowed",
        ),
});

type LinkFormData = z.infer<typeof linkSchema>;

interface LinkEditFormProps {
    link: LinkTable;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (link: LinkTable) => void;
}

function LinkEditForm({
    link,
    open,
    onOpenChange,
    onSuccess,
}: LinkEditFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LinkFormData>({
        resolver: zodResolver(linkSchema),
        defaultValues: {
            original_url: link.original_url,
            alias: link.alias,
        },
    });

    // Reset form when link changes
    useEffect(() => {
        form.reset({
            original_url: link.original_url,
            alias: link.alias,
        });
    }, [link, form]);

    const originalUrlId = useId();
    const aliasId = useId();

    async function onSubmit(data: LinkFormData) {
        setIsLoading(true);

        try {
            const updatedLink = await updateLink(link.id, {
                original_url: data.original_url,
                alias: data.alias,
            });

            toast.success("Link updated successfully!");
            onSuccess?.(updatedLink);
            onOpenChange(false);
        } catch (error) {
            if (error instanceof Error) {
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
                toast.error("Failed to update link. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Credenza open={open} onOpenChange={onOpenChange}>
            <CredenzaContent>
                <CredenzaHeader>
                    <CredenzaTitle>Edit Short Link</CredenzaTitle>
                    <CredenzaDescription>
                        Update the details for this short link.
                    </CredenzaDescription>
                </CredenzaHeader>
                <CredenzaBody>
                    <form
                        id="link-edit-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FieldGroup>
                            <Controller
                                name="alias"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={aliasId}>
                                            Alias
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={aliasId}
                                            type="text"
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
                        form="link-edit-form"
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </CredenzaFooter>
            </CredenzaContent>
        </Credenza>
    );
}

export { LinkEditForm };
