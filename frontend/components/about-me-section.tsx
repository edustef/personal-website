import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import meTransparent from "@/assets/images/me-transparent.png";
import { getTranslations, getLocale } from "next-intl/server";

export default async function AboutMeSection() {
	const locale = await getLocale();
	const t = await getTranslations({ locale, namespace: "home" });

	return (
		<section className="py-24 md:py-32">
			<div className="mx-auto max-w-6xl px-4">
				<div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
					<div className="shrink-0">
						<div
							style={{
								maskImage:
									"radial-gradient(ellipse 55% 50% at center, black 40%, transparent 100%)",
								WebkitMaskImage:
									"radial-gradient(ellipse 50% 50% at center, black 40%, transparent 100%)",
							}}
						>
							<PixelatedCanvas
								src={meTransparent.src}
								width={400}
								height={600}
								cellSize={2}
								dotScale={0.9}
								shape="square"
								backgroundColor="#fff"
								dropoutStrength={0.3}
								interactive
								distortionStrength={1}
								distortionRadius={80}
								distortionMode="swirl"
								followSpeed={0.2}
								jitterStrength={4}
								jitterSpeed={4}
								sampleAverage
								tintColor="#FFFFFF"
								tintStrength={0.2}
							/>
						</div>
					</div>
					<div className="flex-1 text-center lg:text-left">
						<h2 className="text-foreground mb-4 text-3xl tracking-tight md:text-4xl">
							{t("aboutMe.headline")}
						</h2>
						<p className="text-muted-foreground mb-6 text-lg leading-relaxed">
							{t("aboutMe.description")}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
