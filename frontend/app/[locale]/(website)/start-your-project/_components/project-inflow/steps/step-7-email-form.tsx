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
import { Link } from "@/i18n/navigation";

const createEmailFormSchema = (
  emailErrorMessage: string,
  privacyErrorMessage: string,
) =>
  z.object({
    email: z.email(emailErrorMessage),
    bookCall: z.boolean(),
    privacyConsent: z.boolean().refine((val) => val === true, {
      message: privacyErrorMessage,
    }),
  });

type EmailFormValues = {
  email: string;
  bookCall: boolean;
  privacyConsent: boolean;
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

  const emailFormSchema = createEmailFormSchema(
    t("step7.email.error"),
    t("step7.privacyConsent.error"),
  );

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
      bookCall: false,
      privacyConsent: false,
    },
    values: {
      email: "",
      bookCall: false,
      privacyConsent: false,
    },
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
          <Controller
            name="privacyConsent"
            control={emailForm.control}
            render={({ field, fieldState }) => (
              <Field className="flex flex-col items-start" orientation="horizontal" data-invalid={fieldState.invalid}>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="email-form-privacyConsent"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked === true);
                    }}
                    className="mt-0.5"
                  />
                  <FieldLabel
                    htmlFor="email-form-privacyConsent"
                    className="text-sm block"
                  >
                    {t("step7.privacyConsent.label")}{" "}
                    <Link
                      href="/privacy-policy"
                      className="inline underline hover:no-underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("step7.privacyConsent.link")}
                    </Link>
                    .
                  </FieldLabel>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
