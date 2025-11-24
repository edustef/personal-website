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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { sendProjectInquiryEmail } from "@/lib/actions";

const TOTAL_STEPS = 7;

type ClientProjectInflowProps = {
  recipientEmail?: string;
};

const emailFormSchema = z.object({
  email: z.email("Please enter a valid email address."),
  bookCall: z.boolean(),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

export function ClientProjectInflow({
  recipientEmail,
}: ClientProjectInflowProps = {}) {
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

      toast.success("Project inquiry submitted! We'll be in touch soon.");
      localStorage.removeItem("project_inquiry_session");
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Failed to submit. Please try again.");
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
      case 0: // Tech Check
        return (
          <motion.div layout className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">First things first...</h2>
            <p className="text-muted-foreground">
              To tailor the questions for you, are you technical?
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CardOption
                selected={inquiry.isTech === true}
                onClick={async () => {
                  await updateField("isTech", true);
                  await handleNext();
                }}
                title="Yes, I'm technical"
                description="I understand code, stacks, and development flows."
              />
              <CardOption
                selected={inquiry.isTech === false}
                onClick={async () => {
                  await updateField("isTech", false);
                  await handleNext();
                }}
                title="No, I'm non-technical"
                description="I focus on business/design, I need you to handle the tech."
              />
            </div>
          </motion.div>
        );
      case 1: // Goal & Project Type
        return (
          <motion.div layout className="flex flex-col gap-6">
            <StepHeader
              title="What do you want to create or improve?"
              description="Select all that apply."
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                "A new website",
                "Improve/redesign current website",
                "A mobile app (iOS/Android)",
                "Add AI features",
                "Improve performance/SEO",
                "Ongoing maintenance",
                "Not sure yet",
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
      case 2: // Audience & Purpose
        return (
          <motion.div layout className="flex flex-col gap-6">
            <StepHeader
              title="Audience & Purpose"
              description="Who is this for and what is the main goal?"
            />

            <div className="space-y-4">
              <Label>Who is your project for?</Label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {["Customers", "Internal team", "Community/users", "Other"].map(
                  (opt) => (
                    <CardOption
                      size="sm"
                      key={opt}
                      selected={inquiry.targetAudience === opt}
                      onClick={() => updateField("targetAudience", opt)}
                      title={opt}
                    />
                  ),
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Label>What is the main purpose?</Label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  "Generate leads",
                  "Sell products/services",
                  "Showcase portfolio",
                  "Improve workflow",
                  "Increase conversions",
                  "Validate app idea",
                  "Other",
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
      case 3: // Features
        return (
          <motion.div layout className="flex flex-col gap-6">
            <StepHeader
              title="Which features do you need?"
              description="Select the core functionalities."
            />
            <div className="grid grid-cols-2 gap-3">
              {[
                "Landing page",
                "Multi-page website",
                "Blog",
                "Booking system",
                "E-commerce",
                "API integrations",
                "Headless CMS",
                "Custom components",
                "Authentication",
                "User profiles",
                "Chat/Messaging",
                "Push notifications",
                "Maps/Geolocation",
                "Payments",
                "AI assistant",
                "Custom chatbot",
                "Automated workflows",
                "Data dashboards",
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
      case 4: // Current State
        return (
          <motion.div layout className="flex flex-col gap-6">
            <StepHeader title="Do you already have something started?" />
            <RadioGroup
              value={inquiry.currentStatus ?? ""}
              onValueChange={(v) => updateField("currentStatus", v)}
            >
              {[
                "No, starting from scratch",
                "Yes — needs improvement",
                "I have designs",
                "I have branding",
                "I have backend/API",
                "I have content",
                "Just exploring",
              ].map((o) => (
                <div key={o} className="flex items-center space-x-2 py-1">
                  <RadioGroupItem value={o} id={o} />
                  <Label htmlFor={o}>{o}</Label>
                </div>
              ))}
            </RadioGroup>

            {inquiry.currentStatus?.includes("Yes") && (
              <div className="space-y-2">
                <Label>Share your current link (optional)</Label>
                <Input
                  value={inquiry.currentLink ?? ""}
                  onChange={(e) => updateField("currentLink", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            )}
          </motion.div>
        );
      case 5: // Budget & Timeline
        return (
          <motion.div layout className="flex flex-col gap-6">
            <StepHeader
              title="Budget & Timeline"
              description="This helps me understand the scope."
            />

            <div className="space-y-4">
              <Label>Budget Range</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "€1,000–2,500",
                  "€2,500–5,000",
                  "€5,000–10,000",
                  "€10,000+",
                  "I don’t know yet",
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
              <Label>When would you like to start?</Label>
              <Select
                value={inquiry.timeline}
                onValueChange={(v) => updateField("timeline", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Timeline" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "ASAP",
                    "In 1–2 months",
                    "In 3+ months",
                    "Just exploring",
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
      case 6: // Business Context
        return (
          <motion.div layout className="flex flex-col gap-6">
            <StepHeader
              title="Tell me a bit about your business or goals"
              description="Optional context to help me understand."
            />
            <Textarea
              value={inquiry.businessContext}
              onChange={(e) => updateField("businessContext", e.target.value)}
              placeholder="My business helps X do Y..."
              className="min-h-[120px]"
            />
            <div className="space-y-2">
              <Label>What does success look like for you?</Label>
              <Textarea
                value={inquiry.successCriteria}
                onChange={(e) => updateField("successCriteria", e.target.value)}
                placeholder="I want to increase sales by 20%..."
              />
            </div>
          </motion.div>
        );
      case 7: // Email + CTA
        return (
          <motion.div layout className="flex flex-col gap-6">
            <StepHeader title="Where should I send your personalized plan?" />
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
                        Email Address
                      </FieldLabel>
                      <Input
                        {...field}
                        id="email-form-email"
                        type="email"
                        placeholder="you@example.com"
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
                          I'd also like to book a 15-min intro call.
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
                  ? "Submitting..."
                  : "Get My Personalized Estimate"}
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
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        )}
        <div className="flex-1" />
        {currentStep > 0 && currentStep < TOTAL_STEPS && (
          <Button onClick={handleNext}>
            Next <ChevronRight className="ml-2 h-4 w-4" />
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
