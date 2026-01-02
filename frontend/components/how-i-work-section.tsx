import { getTranslations, getLocale } from "next-intl/server";

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

	return (
		<section id="how-i-work" className="bg-muted/30 py-24 md:py-32">
			<div className="mx-auto max-w-6xl px-4">
				<div className="mb-16 text-center">
					<p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
						{t("label")}
					</p>
					<h2 className="text-foreground mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
						<a
							href="#how-i-work"
							className="hover:text-primary transition-colors"
						>
							{t("headline")}
						</a>
					</h2>
					<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
						{t("subtitle")}
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
					{steps.map((step) => (
						<div
							key={step.key}
							className="flex flex-col rounded-2xl border border-border bg-card p-6"
						>
							<div className="bg-primary/10 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold">
								{step.icon}
							</div>
							<h3 className="text-foreground mb-3 text-xl font-semibold">
								{t(`${step.key}.title`)}
							</h3>
							<p className="text-muted-foreground leading-relaxed">
								{t(`${step.key}.description`)}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

