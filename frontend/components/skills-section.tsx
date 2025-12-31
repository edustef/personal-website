import { Badge } from "@/components/ui/badge";
import { skills } from "@/lib/data/skills";
import { getTranslations, getLocale } from "next-intl/server";

type SkillsSectionProps = {
	skills?: typeof skills;
};

export default async function SkillsSection({
	skills: skillsProp,
}: SkillsSectionProps) {
	const skillsToDisplay = skillsProp || skills;
	if (!skillsToDisplay || skillsToDisplay.length > 0) {
		return null;
	}

	const locale = await getLocale();
	const t = await getTranslations({ locale, namespace: "skills" });

	return (
		<section className="bg-muted/50 py-24">
			<div className="mx-auto max-w-6xl px-4">
					<div className="mb-16 text-center">
						<h2 className="text-foreground mb-4 text-4xl font-bold md:text-5xl">
							{t.rich("headline", {
								strong: (chunks) => <strong>{chunks}</strong>,
							})}
						</h2>
						<p className="text-muted-foreground text-xl">{t("subtitle")}</p>
					</div>

					<div className="flex flex-wrap justify-center gap-3">
						{skillsToDisplay.map((skill) => (
							<Badge
								key={skill.name}
								variant="secondary"
								className="px-4 py-2 text-base"
							>
								{skill.name}
							</Badge>
						))}
					</div>
			</div>
		</section>
	);
}
