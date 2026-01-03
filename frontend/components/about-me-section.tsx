import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import meTransparent from "@/assets/images/me-transparent.png";

export default async function AboutMeSection() {
	const locale = await getLocale();
	const t = await getTranslations({ locale, namespace: "home" });

	return (
		<section id="about-me" className="py-24 md:py-32">
			<div className="mx-auto max-w-6xl px-4">
				<div className="mb-16 text-center">
					<p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
						{t("aboutMe.label")}
					</p>
					<h2 className="text-foreground mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
						<a
							href="#about-me"
							className="hover:text-primary transition-colors"
						>
							{t("aboutMe.headline")}
						</a>
					</h2>
					<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
						{t("aboutMe.subtitle")}
					</p>
				</div>
				<div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
					<div className="shrink-0">
						<div
							style={{
								maskImage:
									"radial-gradient(110% 105% at right top, black 50%, transparent 100%)",
								WebkitMaskImage:
									"radial-gradient(110% 105% at right top, black 50%, transparent 100%)",
							}}
						>
							<Image
								src={meTransparent.src}
								width={400}
								height={600}
								alt="About me"
							/>
						</div>
					</div>
					<div className="flex-1 text-center lg:text-left">
						<p className="text-muted-foreground text-lg leading-relaxed">
							{t("aboutMe.description")}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
