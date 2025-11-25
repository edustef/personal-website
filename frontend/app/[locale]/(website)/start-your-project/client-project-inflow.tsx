"use client";

import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useProjectInquiry } from "@/app/[locale]/(website)/start-your-project/use-project-inquiry";
import { sendProjectInquiryEmail } from "@/lib/actions";
import { ProgressBar } from "./_components/project-inflow/progress-bar";
import { Navigation } from "./_components/project-inflow/navigation";
import { Step0TechSelection } from "./_components/project-inflow/steps/step-0-tech-selection";
import { Step1ProjectType } from "./_components/project-inflow/steps/step-1-project-type";
import { Step2AudiencePurpose } from "./_components/project-inflow/steps/step-2-audience-purpose";
import { Step3Features } from "./_components/project-inflow/steps/step-3-features";
import { Step4CurrentStatus } from "./_components/project-inflow/steps/step-4-current-status";
import { Step5BudgetTimeline } from "./_components/project-inflow/steps/step-5-budget-timeline";
import { Step6BusinessContext } from "./_components/project-inflow/steps/step-6-business-context";
import { Step7EmailForm } from "./_components/project-inflow/steps/step-7-email-form";
import { Spotlight } from "@/components/ui/spotlight-new";

const TOTAL_STEPS = 7;

type ClientProjectInflowProps = {
  recipientEmail?: string;
};

type EmailFormValues = {
  email: string;
  bookCall: boolean;
};

export function ClientProjectInflow({
  recipientEmail,
}: ClientProjectInflowProps = {}) {
  const t = useTranslations("clientProjectInflow");
  const {
    isMounted,
    id,
    inquiry,
    submitInquiry,
    updateField,
    handleOptionToggle,
    goToStep,
    clearSession,
  } = useProjectInquiry();

  const currentStep = inquiry?.currentStep ?? 0;

  const handleNext = async () => {
    if (!inquiry || !id) return;
    if (currentStep < TOTAL_STEPS) {
      await goToStep(currentStep + 1);
    }
  };

  const handleBack = async () => {
    if (!inquiry || !id) return;
    if (currentStep > 0) {
      await goToStep(currentStep - 1);
    }
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
      clearSession();
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

  const renderStep = () => {
    if (!id) return null;

    switch (currentStep) {
      case 0:
        return (
          <Step0TechSelection
            inquiryId={id}
            onSelect={async (isTech) => {
              await updateField("isTech", isTech);
              await handleNext();
            }}
          />
        );
      case 1:
        return (
          <Step1ProjectType
            inquiryId={id}
            onToggle={(value) => handleOptionToggle("projectType", value)}
          />
        );
      case 2:
        return (
          <Step2AudiencePurpose
            inquiryId={id}
            onSelectAudience={(value) => updateField("targetAudience", value)}
            onSelectPurpose={(value) => updateField("projectPurpose", value)}
          />
        );
      case 3:
        return (
          <Step3Features
            inquiryId={id}
            onToggle={(value) => handleOptionToggle("features", value)}
          />
        );
      case 4:
        return (
          <Step4CurrentStatus
            inquiryId={id}
            onStatusChange={(value) => updateField("currentStatus", value)}
            onLinkChange={(value) => updateField("currentLink", value)}
          />
        );
      case 5:
        return (
          <Step5BudgetTimeline
            inquiryId={id}
            onBudgetChange={(value) => updateField("budgetRange", value)}
            onTimelineChange={(value) => updateField("timeline", value)}
          />
        );
      case 6:
        return (
          <Step6BusinessContext
            inquiryId={id}
            onBusinessContextChange={(value) =>
              updateField("businessContext", value)
            }
            onSuccessCriteriaChange={(value) =>
              updateField("successCriteria", value)
            }
          />
        );
      case 7:
        return (
          <Step7EmailForm
            inquiryId={id}
            onSubmit={handleSubmit}
            onEmailChange={(value) => updateField("email", value)}
            onBookCallChange={(value) => updateField("bookCall", value)}
          />
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
      <Spotlight />
      <ProgressBar
        className={currentStep === 0 ? "hidden" : ""}
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
      />

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

      <Navigation
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onBack={handleBack}
        onNext={handleNext}
        backLabel={t("navigation.back")}
        nextLabel={t("navigation.next")}
      />
    </motion.div>
  );
}
