"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { motion } from "motion/react";
import { CardOption } from "../card-option";
import { StepHeader } from "../step-header";
import { useTranslations } from "next-intl";

type Step2AudiencePurposeProps = {
	inquiryId: Id<"projectInquiries">;
	onSelectAudience: (value: string) => Promise<void>;
	onSelectPurpose: (value: string) => Promise<void>;
};

export function Step2AudiencePurpose({
	inquiryId,
	onSelectAudience,
	onSelectPurpose,
}: Step2AudiencePurposeProps) {
	const t = useTranslations("clientProjectInflow");
	const inquiry = useQuery(api.projectInquiries.getInquiry, {
		_id: inquiryId,
	});

	if (!inquiry) return null;

	const audienceOptions = [
		t("step2.audience.customers"),
		t("step2.audience.internalTeam"),
		t("step2.audience.community"),
		t("step2.audience.other"),
	];

	const purposeOptions = [
		t("step2.purpose.generateLeads"),
		t("step2.purpose.sellProducts"),
		t("step2.purpose.showcasePortfolio"),
		t("step2.purpose.improveWorkflow"),
		t("step2.purpose.increaseConversions"),
		t("step2.purpose.validateIdea"),
		t("step2.purpose.other"),
	];

	return (
		<motion.div layout className="flex flex-col gap-6">
			<StepHeader
				title={t("step2.title")}
				description={t("step2.description")}
			/>

			<div className="space-y-4">
				<fieldset>
					<legend className="text-sm font-medium leading-none mb-2">
						{t("step2.audience.label")}
					</legend>
					<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
						{audienceOptions.map((opt) => (
							<CardOption
								size="sm"
								key={opt}
								selected={inquiry.targetAudience === opt}
								onChange={() => onSelectAudience(opt)}
								name="targetAudience"
								value={opt}
								id={`targetAudience-${opt.replace(/\s+/g, "-").toLowerCase()}`}
								title={opt}
							/>
						))}
					</div>
				</fieldset>
			</div>

			<div className="space-y-4">
				<fieldset>
					<legend className="text-sm font-medium leading-none mb-2">
						{t("step2.purpose.label")}
					</legend>
					<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
						{purposeOptions.map((opt) => (
							<CardOption
								size="sm"
								key={opt}
								selected={inquiry.projectPurpose === opt}
								onChange={() => onSelectPurpose(opt)}
								name="projectPurpose"
								value={opt}
								id={`projectPurpose-${opt.replace(/\s+/g, "-").toLowerCase()}`}
								title={opt}
							/>
						))}
					</div>
				</fieldset>
			</div>
		</motion.div>
	);
}
