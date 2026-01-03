import { getLocale, getTranslations } from "next-intl/server";
import { ToolsSlider } from "@/components/tools-slider";
import { AnimatedContainer } from "@/components/ui/animated-container";

export default async function ToolsSection() {
	const locale = await getLocale();
	const t = await getTranslations({ locale, namespace: "home" });

	return (
		<section id="tools" className="w-full pt-24 md:pt-32">
			<div className="mx-auto max-w-6xl px-4">
				<AnimatedContainer
					className="text-center"
					fadeDirection="up"
					delay={0.2}
				>
					{/* <h2 className="text-foreground text-3xl tracking-tight md:text-4xl">
						<a
							href="#tools"
							className="hover:text-primary transition-colors"
						>
							{t("workedWith")}
						</a>
					</h2> */}
				</AnimatedContainer>
			</div>
			<ToolsSlider />
		</section>
	);
}
