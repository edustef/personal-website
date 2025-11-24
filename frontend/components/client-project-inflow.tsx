"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "motion/react";
import { Check, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { sendProjectInquiryEmail } from "@/lib/actions";
import { useTranslations } from "next-intl";

const TOTAL_STEPS = 7;

type ClientProjectInflowProps = {
  recipientEmail?: string;
};

const createEmailFormSchema = (errorMessage: string) =>
  z.object({
    email: z.email(errorMessage),
    bookCall: z.boolean(),
  });

type EmailFormValues = {
  email: string;
  bookCall: boolean;
};

export function ClientProjectInflow({
  recipientEmail,
}: ClientProjectInflowProps = {}) {
  const t = useTranslations("clientProjectInflow");
  const [isMounted, setIsMounted] = useState(false);
  const [id, setId] = useState<Id<"projectInquiries"> | undefined>(undefined);

  const inquiry = useQuery(
    api.projectInquiries.getInquiry,
    id ? { _id: id } : "skip",
  );

  const saveProgress = useMutation(api.projectInquiries.saveProgress);
  const submitInquiry = useMutation(api.projectInquiries.submitInquiry);

  const currentStep = inquiry?.currentStep ?? 0;
  const isEmailStep = currentStep === 7;

  const emailFormSchema = createEmailFormSchema(t("step7.email.error"));

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
      bookCall: false,
    },
    values:
      isEmailStep && inquiry
        ? {
            email: inquiry.email ?? "",
            bookCall: inquiry.bookCall ?? false,
          }
        : undefined,
    mode: "onBlur",
  });

  useEffect(() => {
    setIsMounted(true);

    const init = async () => {
      const storedSession = localStorage.getItem("project_inquiry_session");
      if (storedSession) {
        const storedId = storedSession as Id<"projectInquiries">;
        setId(storedId);
      } else {
        const newId = await saveProgress({});
        setId(newId);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (id) {
      localStorage.setItem("project_inquiry_session", id);
    }
  }, [id]);

  useEffect(() => {
    if (isMounted && id && inquiry === null) {
      const handleMissingDocument = async () => {
        localStorage.removeItem("project_inquiry_session");
        const newId = await saveProgress({});
        setId(newId);
      };
      handleMissingDocument();
    }
  }, [isMounted, id, inquiry, saveProgress]);

  const handleNext = async () => {
    if (!inquiry || !id) return;
    const currentStep = inquiry.currentStep ?? 0;
    if (currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1;
      await saveProgress({
        _id: id,
        currentStep: nextStep,
      });
    }
  };

  const handleBack = async () => {
    if (!inquiry || !id) return;
    const currentStep = inquiry.currentStep ?? 0;
    if (currentStep > 0) {
      await saveProgress({
        _id: id,
        currentStep: currentStep - 1,
      });
    }
  };

  const handleOptionToggle = async (
    field: keyof Pick<
      Doc<"projectInquiries">,
      "projectType" | "features" | "existingResources"
    >,
    value: string,
  ) => {
    if (!inquiry || !id) return;
    const currentValue = inquiry[field] ?? [];
    const isSelected = currentValue.includes(value);
    const updatedValue = isSelected
      ? currentValue.filter((item) => item !== value)
      : [...currentValue, value];
    await saveProgress({
      _id: id,
      [field]: updatedValue,
    });
  };

  const updateField = async (
    field: keyof Omit<
      Doc<"projectInquiries">,
      "projectType" | "features" | "existingResources"
    >,
    value: string | boolean,
  ) => {
    if (!id) return;
    await saveProgress({
      _id: id,
      [field]: value,
    });
  };

  const handleSubmit = async (data: EmailFormValues) => {
    if (!id || !inquiry) return;
    try {
      await submitInquiry({
        _id: id,
        email: data.email,
        bookCall: data.bookCall,
      });

      const emailResult = await sendProjectInquiryEmail(
        {
          email: data.email,
          isTech: inquiry.isTech,
          projectType: inquiry.projectType,
          targetAudience: inquiry.targetAudience,
          projectPurpose: inquiry.projectPurpose,
          features: inquiry.features,
          currentStatus: inquiry.currentStatus,
          currentLink: inquiry.currentLink,
          budgetRange: inquiry.budgetRange,
          timeline: inquiry.timeline,
          businessContext: inquiry.businessContext,
          successCriteria: inquiry.successCriteria,
          bookCall: data.bookCall,
        },
        recipientEmail,
      );

      if (!emailResult.success) {
        console.error("Failed to send email:", emailResult.message);
      }

      toast.success(t("messages.submitted"));
      localStorage.removeItem("project_inquiry_session");
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error(t("messages.submitError"));
    }
  };

  if (!isMounted) return null;
  if (id === undefined) return null;
  if (inquiry === undefined) {
    return (
      <div className="mx-auto flex w-full max-w-2xl items-center justify-center p-4 md:p-0">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (inquiry === null) return null;

  // Steps Rendering Logic
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div layout className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">{t("step0.title")}</h2>
            <p className="text-muted-foreground">{t("step0.description")}</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CardOption
                selected={inquiry.isTech === true}
                onClick={async () => {
                  await updateField("isTech", true);
                  await handleNext();
                }}
                title={t("step0.technical.title")}
                description={t("step0.technical.description")}
              />
              <CardOption
                selected={inquiry.isTech === false}
                onClick={async () => {
                  await updateField("isTech", false);
                  await handleNext();
                }}
                title={t("step0.nonTechnical.title")}
                description={t("step0.nonTechnical.description")}
              />
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div layout className="flex flex-col gap-6">
            <StepHeader
              title={t("step1.title")}
              description={t("step1.description")}
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                t("step1.options.newWebsite"),
                t("step1.options.improveWebsite"),
                t("step1.options.mobileApp"),
                t("step1.options.aiFeatures"),
                t("step1.options.performance"),
                t("step1.options.maintenance"),
                t("step1.options.notSure"),
              ].map((opt) => (
                <CardOption
                  size="sm"
                  key={opt}
                  selected={inquiry.projectType?.includes(opt) ?? false}
                  onClick={() => handleOptionToggle("projectType", opt)}
                  title={opt}
                  multi
                />
              ))}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div layout className="flex flex-col gap-6">
            <StepHeader
              title={t("step2.title")}
              description={t("step2.description")}
            />

            <div className="space-y-4">
              <Label>{t("step2.audience.label")}</Label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  t("step2.audience.customers"),
                  t("step2.audience.internalTeam"),
                  t("step2.audience.community"),
                  t("step2.audience.other"),
                ].map((opt) => (
                  <CardOption
                    size="sm"
                    key={opt}
                    selected={inquiry.targetAudience === opt}
                    onClick={() => updateField("targetAudience", opt)}
                    title={opt}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>{t("step2.purpose.label")}</Label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  t("step2.purpose.generateLeads"),
                  t("step2.purpose.sellProducts"),
                  t("step2.purpose.showcasePortfolio"),
                  t("step2.purpose.improveWorkflow"),
                  t("step2.purpose.increaseConversions"),
                  t("step2.purpose.validateIdea"),
                  t("step2.purpose.other"),
                ].map((opt) => (
                  <CardOption
                    size="sm"
                    key={opt}
                    selected={inquiry.projectPurpose === opt}
                    onClick={() => updateField("projectPurpose", opt)}
                    title={opt}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div layout className="flex flex-col gap-6">
            <StepHeader
              title={t("step3.title")}
              description={t("step3.description")}
            />
            <div className="grid grid-cols-2 gap-3">
              {[
                t("step3.features.landingPage"),
                t("step3.features.multiPage"),
                t("step3.features.blog"),
                t("step3.features.booking"),
                t("step3.features.ecommerce"),
                t("step3.features.apiIntegrations"),
                t("step3.features.headlessCms"),
                t("step3.features.customComponents"),
                t("step3.features.authentication"),
                t("step3.features.userProfiles"),
                t("step3.features.chatMessaging"),
                t("step3.features.pushNotifications"),
                t("step3.features.mapsGeolocation"),
                t("step3.features.payments"),
                t("step3.features.aiAssistant"),
                t("step3.features.customChatbot"),
                t("step3.features.automatedWorkflows"),
                t("step3.features.dataDashboards"),
              ].map((opt) => (
                <CardOption
                  key={opt}
                  selected={inquiry.features?.includes(opt) ?? false}
                  onClick={() => handleOptionToggle("features", opt)}
                  title={opt}
                  multi
                  compact
                />
              ))}
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div layout className="flex flex-col gap-6">
            <StepHeader title={t("step4.title")} />
            <RadioGroup
              value={inquiry.currentStatus ?? ""}
              onValueChange={(v) => updateField("currentStatus", v)}
            >
              {[
                t("step4.options.fromScratch"),
                t("step4.options.needsImprovement"),
                t("step4.options.haveDesigns"),
                t("step4.options.haveBranding"),
                t("step4.options.haveBackend"),
                t("step4.options.haveContent"),
                t("step4.options.justExploring"),
              ].map((o) => (
                <div key={o} className="flex items-center space-x-2 py-1">
                  <RadioGroupItem value={o} id={o} />
                  <Label htmlFor={o}>{o}</Label>
                </div>
              ))}
            </RadioGroup>

            {inquiry.currentStatus === t("step4.options.needsImprovement") && (
              <div className="space-y-2">
                <Label>{t("step4.currentLink.label")}</Label>
                <Input
                  value={inquiry.currentLink ?? ""}
                  onChange={(e) => updateField("currentLink", e.target.value)}
                  placeholder={t("step4.currentLink.placeholder")}
                />
              </div>
            )}
          </motion.div>
        );
      case 5:
        return (
          <motion.div layout className="flex flex-col gap-6">
            <StepHeader
              title={t("step5.title")}
              description={t("step5.description")}
            />

            <div className="space-y-4">
              <Label>{t("step5.budget.label")}</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  t("step5.budget.range1"),
                  t("step5.budget.range2"),
                  t("step5.budget.range3"),
                  t("step5.budget.range4"),
                  t("step5.budget.dontKnow"),
                ].map((opt) => (
                  <CardOption
                    key={opt}
                    selected={inquiry.budgetRange === opt}
                    onClick={() => updateField("budgetRange", opt)}
                    title={opt}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>{t("step5.timeline.label")}</Label>
              <Select
                value={inquiry.timeline}
                onValueChange={(v) => updateField("timeline", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("step5.timeline.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {[
                    t("step5.timeline.asap"),
                    t("step5.timeline.oneTwoMonths"),
                    t("step5.timeline.threePlusMonths"),
                    t("step5.timeline.justExploring"),
                  ].map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        );
      case 6:
        return (
          <motion.div layout className="flex flex-col gap-6">
            <StepHeader
              title={t("step6.title")}
              description={t("step6.description")}
            />
            <Textarea
              value={inquiry.businessContext}
              onChange={(e) => updateField("businessContext", e.target.value)}
              placeholder={t("step6.businessContext.placeholder")}
              className="min-h-[120px]"
            />
            <div className="space-y-2">
              <Label>{t("step6.successCriteria.label")}</Label>
              <Textarea
                value={inquiry.successCriteria}
                onChange={(e) => updateField("successCriteria", e.target.value)}
                placeholder={t("step6.successCriteria.placeholder")}
              />
            </div>
          </motion.div>
        );
      case 7:
        return (
          <motion.div layout className="flex flex-col gap-6">
            <StepHeader title={t("step7.title")} />
            <form
              id="email-form"
              onSubmit={emailForm.handleSubmit(handleSubmit)}
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
                          if (id && !fieldState.invalid && field.value) {
                            updateField("email", field.value);
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
                            if (id) {
                              updateField("bookCall", checked === true);
                            }
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
      default:
        return null;
    }
  };

  return (
    <motion.div
      layout
      className="mx-auto w-full max-w-2xl p-4 md:p-0"
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="bg-muted h-2 overflow-hidden rounded-full">
          <motion.div
            className="bg-primary h-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="min-h-[300px]"
        transition={{
          duration: 0.3,
        }}
      >
        {renderStep()}
      </motion.div>

      <motion.div
        layout
        className="mt-8 flex justify-between border-t pt-8"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {currentStep > 0 && (
          <Button variant="ghost" onClick={handleBack}>
            <ChevronLeft className="mr-2 h-4 w-4" /> {t("navigation.back")}
          </Button>
        )}
        <div className="flex-1" />
        {currentStep > 0 && currentStep < TOTAL_STEPS && (
          <Button onClick={handleNext}>
            {t("navigation.next")} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}

function StepHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}

function CardOption({
  title,
  description,
  selected,
  onClick,
  multi = false,
  compact = false,
  size = "md",
}: {
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
  compact?: boolean;
  size?: "sm" | "md";
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "hover:border-primary/50 cursor-pointer rounded-lg border-2 transition-all",
        selected ? "border-primary bg-primary/5" : "border-muted bg-card",
        size === "sm" ? "p-3" : "p-4",
        compact ? "py-3" : "",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <h3
            className={cn(
              "leading-none font-medium",
              size === "sm" || compact ? "text-sm" : "",
            )}
          >
            {title}
          </h3>
          {description && (
            <p
              className={cn(
                "text-muted-foreground",
                size === "sm" ? "text-xs" : "text-sm",
              )}
            >
              {description}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded border",
            size === "sm" ? "h-4 w-4" : "h-5 w-5",
            multi ? "rounded-sm" : "rounded-full",
            selected
              ? "bg-primary border-primary text-primary-foreground"
              : "border-muted-foreground",
          )}
        >
          {selected &&
            (multi ? (
              <Check className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} />
            ) : (
              <div
                className={cn(
                  "bg-primary-foreground rounded-full",
                  size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
                )}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
