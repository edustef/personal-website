"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
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
import Form from "next/form";

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
  const data = hasErrors ? state.data : undefined;

  return (
    <Form
      ref={formRef}
      action={formAction}
      className="flex w-full flex-col gap-4"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
        className="hidden"
        aria-hidden="true"
      />
      <h2 className="text-2xl font-bold">Contact me</h2>
      <FieldGroup>
        <Field>
          <FieldLabel>My email address</FieldLabel>
          <Input disabled value={recipientEmail} />
        </Field>
        <Field data-invalid={!!emailErrors}>
          <FieldLabel>Your email address</FieldLabel>
          <Input
            defaultValue={data?.email || ""}
            name="email"
            type="text"
            placeholder="Your email address"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="email"
            spellCheck={false}
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
            className="max-h-52 min-h-30"
            defaultValue={data?.message || ""}
            name="message"
            placeholder="Your message..."
            minLength={2}
            maxLength={5000}
            autoComplete="off"
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
    </Form>
  );
}
