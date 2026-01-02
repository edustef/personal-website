import { getTranslations, getLocale } from "next-intl/server";
import { HowIWorkSectionClient } from "./how-i-work-section-client";

const steps = [
	{
		key: "planning",
		icon: "1",
	},
	{
		key: "development",
		icon: "2",
	},
	{
		key: "deployment",
		icon: "3",
	},
	{
		key: "postDeployment",
		icon: "4",
	},
];

export default async function HowIWorkSection() {
	const locale = await getLocale();
	const t = await getTranslations({ locale, namespace: "howIWork" });

	const timelineData = steps.map((step) => ({
		title: t(`${step.key}.title`),
		content: (
			<div>
				<p className="text-foreground text-sm md:text-base font-normal mb-4">
					{t(`${step.key}.description`)}
				</p>
			</div>
		),
	}));

	return (
		<HowIWorkSectionClient
			label={t("label")}
			headline={t("headline")}
			subtitle={t("subtitle")}
			timelineData={timelineData}
		/>
	);
}

