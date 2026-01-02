import { getLocale, getTranslations } from "next-intl/server";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { WorkedWithSlider } from "@/components/worked-with-slider";

export default async function WorkedWithSection() {
	const locale = await getLocale();
	const t = await getTranslations({ locale, namespace: "home" });

	return (
		<section id="worked-with" className="w-full pt-24 md:pt-32">
			<div className="mx-auto max-w-6xl px-4">
				<AnimatedContainer
					className="text-center"
					fadeDirection="up"
					delay={0.2}
				>
					{/* <h2 className="text-foreground text-3xl tracking-tight md:text-4xl">
						<a
							href="#worked-with"
							className="hover:text-primary transition-colors"
						>
							{t("workedWith")}
						</a>
					</h2> */}
				</AnimatedContainer>
			</div>
			<WorkedWithSlider />
		</section>
	);
}
