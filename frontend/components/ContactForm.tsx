"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { z } from "zod";
import { toast } from "sonner";

import { submitContactForm, type ContactFormState } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

const contactFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters"),
});

type ContactFormProps = {
  recipientEmail: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Sending..." : "Send"}
    </Button>
  );
}

export function ContactForm({ recipientEmail }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState<ContactFormState | null, FormData>(
    async (prevState: ContactFormState | null, formData: FormData) => {
      return submitContactForm(prevState, formData, recipientEmail);
    },
    null,
  );

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(
        state.message || "Your message has been sent successfully!",
      );
      formRef.current?.reset();
    } else {
      if (state.errors) {
        const errorMessages = Object.values(state.errors)
          .flat()
          .filter(Boolean);
        if (errorMessages.length > 0) {
          toast.error(errorMessages[0]);
        } else {
          toast.error("Please check the form for errors and try again.");
        }
      } else {
        toast.error(
          state.message || "An error occurred. Please try again later.",
        );
      }
    }
  }, [state]);

  const hasErrors = !state?.success && state?.errors;
  const emailErrors = hasErrors ? state.errors?.email : undefined;
  const messageErrors = hasErrors ? state.errors?.message : undefined;

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex w-full flex-col gap-4"
    >
      <h2 className="text-2xl font-bold">Contact me</h2>
      <FieldGroup>
        <Field>
          <FieldLabel>My email address</FieldLabel>
          <Input disabled value={recipientEmail} />
        </Field>
        <Field data-invalid={!!emailErrors}>
          <FieldLabel>Your email address</FieldLabel>
          <Input
            name="email"
            type="email"
            placeholder="Your email address"
            required
            aria-invalid={!!emailErrors}
            aria-describedby={emailErrors ? "email-error" : undefined}
          />
          {emailErrors && (
            <FieldError
              id="email-error"
              errors={emailErrors.map((msg) => ({ message: msg }))}
            />
          )}
        </Field>
        <Field data-invalid={!!messageErrors}>
          <FieldLabel>Your message</FieldLabel>
          <Textarea
            className="min-h-30 max-h-52"
            name="message"
            placeholder="Your message..."
            required
            aria-invalid={!!messageErrors}
            aria-describedby={messageErrors ? "message-error" : undefined}
          />
          {messageErrors && (
            <FieldError
              id="message-error"
              errors={messageErrors.map((msg) => ({ message: msg }))}
            />
          )}
        </Field>
        <SubmitButton />
      </FieldGroup>
    </form>
  );
}
