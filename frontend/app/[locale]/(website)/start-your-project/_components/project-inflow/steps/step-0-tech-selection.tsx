"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "motion/react";
import { CardOption } from "../card-option";
import { useTranslations } from "next-intl";

type Step0TechSelectionProps = {
	inquiryId: Id<"projectInquiries">;
	onSelect: (isTech: boolean) => Promise<void>;
};

export function Step0TechSelection({
	inquiryId,
	onSelect,
}: Step0TechSelectionProps) {
	const t = useTranslations("clientProjectInflow");
	const inquiry = useQuery(api.projectInquiries.getInquiry, {
		_id: inquiryId,
	});

	if (!inquiry) return null;

	return (
		<motion.div layout className="flex flex-col gap-6">
			<h2 className="text-2xl font-bold">{t("step0.title")}</h2>
			<p className="text-muted-foreground">{t("step0.description")}</p>
			<fieldset className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<legend className="sr-only">{t("step0.title")}</legend>
				<CardOption
					selected={inquiry.isTech === true}
					onChange={async () => {
						await onSelect(true);
					}}
					name="isTech"
					value="true"
					id="isTech-true"
					title={t("step0.technical.title")}
					description={t("step0.technical.description")}
				/>
				<CardOption
					selected={inquiry.isTech === false}
					onChange={async () => {
						await onSelect(false);
					}}
					name="isTech"
					value="false"
					id="isTech-false"
					title={t("step0.nonTechnical.title")}
					description={t("step0.nonTechnical.description")}
				/>
			</fieldset>
		</motion.div>
	);
}
