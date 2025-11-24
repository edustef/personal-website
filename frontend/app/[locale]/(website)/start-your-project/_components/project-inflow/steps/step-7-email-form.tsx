"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { StepHeader } from "../step-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";

const createEmailFormSchema = (errorMessage: string) =>
  z.object({
    email: z.email(errorMessage),
    bookCall: z.boolean(),
  });

type EmailFormValues = {
  email: string;
  bookCall: boolean;
};

type Step7EmailFormProps = {
  inquiryId: Id<"projectInquiries">;
  onSubmit: (data: EmailFormValues) => Promise<void>;
  onEmailChange: (value: string) => Promise<void>;
  onBookCallChange: (value: boolean) => Promise<void>;
};

export function Step7EmailForm({
  inquiryId,
  onSubmit,
  onEmailChange,
  onBookCallChange,
}: Step7EmailFormProps) {
  const t = useTranslations("clientProjectInflow");
  const inquiry = useQuery(api.projectInquiries.getInquiry, {
    _id: inquiryId,
  });

  const emailFormSchema = createEmailFormSchema(t("step7.email.error"));

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
      bookCall: false,
    },
    values:
      inquiry
        ? {
            email: inquiry.email ?? "",
            bookCall: inquiry.bookCall ?? false,
          }
        : undefined,
    mode: "onBlur",
  });

  if (!inquiry) return null;

  return (
    <motion.div layout className="flex flex-col gap-6">
      <StepHeader title={t("step7.title")} />
      <form
        id="email-form"
        onSubmit={emailForm.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FieldGroup>
          <Controller
            name="email"
            control={emailForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email-form-email">
                  {t("step7.email.label")}
                </FieldLabel>
                <Input
                  {...field}
                  id="email-form-email"
                  type="email"
                  placeholder={t("step7.email.placeholder")}
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  onBlur={(e) => {
                    field.onBlur();
                    if (!fieldState.invalid && field.value) {
                      onEmailChange(field.value);
                    }
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="bookCall"
            control={emailForm.control}
            render={({ field }) => (
              <Field orientation="horizontal">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email-form-bookCall"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked === true);
                      onBookCallChange(checked === true);
                    }}
                  />
                  <FieldLabel htmlFor="email-form-bookCall">
                    {t("step7.bookCall.label")}
                  </FieldLabel>
                </div>
              </Field>
            )}
          />
        </FieldGroup>
        <Button
          type="submit"
          form="email-form"
          className="w-full"
          disabled={emailForm.formState.isSubmitting}
        >
          {emailForm.formState.isSubmitting
            ? t("step7.submit.submitting")
            : t("step7.submit.button")}
        </Button>
      </form>
    </motion.div>
  );
}

