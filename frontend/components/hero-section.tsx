import { getTranslations, getLocale } from "next-intl/server";
import { HighlightBadge } from "@/components/ui/highlight-badge";
import { Button } from "@/components/ui/button";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Link } from "@/i18n/navigation";
import { HERO_CONTACT_BUTTON_ID } from "@/components/contact-button-observer";
import { getSocialIcon } from "@/lib/social-icons";
import { HeroImages } from "@/components/hero-images";

export default async function HeroSection() {
	const locale = await getLocale();
	const [t, profileT] = await Promise.all([
		getTranslations({ locale, namespace: "home" }),
		getTranslations({ locale, namespace: "profile" }),
	]);

	const ctaButtons = t.raw("ctaButtons") as Array<{
		text: string;
		href: string;
		variant: string;
	}>;
	const socialLinks = profileT.raw("socialLinks") as Array<{
		name: string;
		url: string;
	}>;

	return (
		<section className="py-24 md:py-32">
			<div className="mx-auto max-w-6xl px-4">
				<div className="flex w-full flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
					<div className="flex flex-1 flex-col gap-8 order-1 lg:order-1">
						<AnimatedContainer className="flex max-w-2xl flex-col gap-4">
							<HighlightBadge>
								<span>{t("announcementLabelPrimary")}</span>
								<span className="ml-1.5 font-bold">
									{t("announcementLabelSecondary")}
								</span>
							</HighlightBadge>
							<h1 className="text-foreground group relative text-balance text-3xl leading-normal md:text-5xl md:leading-tight">
								{t.rich("headline", {
									strong: (chunks) => (
										<strong className="text-primary font-semibold">
											{chunks}
										</strong>
									),
								})}
							</h1>
							<p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
								{t("tagline")}
							</p>
						</AnimatedContainer>

						<AnimatedContainer className="flex flex-col gap-4 md:flex-row">
							<Button
								asChild
								size="lg"
								variant="default"
								id={HERO_CONTACT_BUTTON_ID}
							>
								<a
									href="https://wa.me/40775378525"
									target="_blank"
									rel="noopener noreferrer"
								>
									{t("contactMe")}
								</a>
							</Button>
							{ctaButtons.map((button) => (
								<Button
									key={button.href}
									asChild
									size="lg"
									variant={
										button.variant as "default" | "outline" | "secondary"
									}
								>
									<Link
										href={
											button.href as "/start-your-project" | "/privacy-policy"
										}
									>
										{button.text}
									</Link>
								</Button>
							))}
						</AnimatedContainer>

						<div className="hidden flex-col gap-4 lg:flex">
							<AnimatedContainer>
								<h2 className="text-foreground text-lg">
									{t("findMeOnLabel")}
								</h2>
							</AnimatedContainer>
							<AnimatedContainer className="flex flex-row gap-4">
								{socialLinks.map(({ url, name }) => {
									const Icon = getSocialIcon(name);
									return (
										<Button
											key={url}
											asChild
											variant="outline"
											className="aspect-square p-0"
										>
											<a
												href={url}
												target="_blank"
												rel="noopener noreferrer"
												aria-label={name}
											>
												{Icon && <Icon className="size-5" />}
											</a>
										</Button>
									);
								})}
							</AnimatedContainer>
						</div>
					</div>

					<div className="lg:self-stretch flex flex-col gap-4 lg:flex-1 order-3 lg:order-2">
						<HeroImages />
					</div>

					<div className="flex flex-col gap-4 order-4 lg:hidden">
						<AnimatedContainer>
							<h2 className="text-foreground text-lg">{t("findMeOnLabel")}</h2>
						</AnimatedContainer>
						<AnimatedContainer className="flex flex-row gap-4">
							{socialLinks.map(({ url, name }) => {
								const Icon = getSocialIcon(name);
								return (
									<Button
										key={url}
										asChild
										variant="outline"
										className="aspect-square p-0"
									>
										<a
											href={url}
											target="_blank"
											rel="noopener noreferrer"
											aria-label={name}
										>
											{Icon && <Icon className="size-5" />}
										</a>
									</Button>
								);
							})}
						</AnimatedContainer>
					</div>
				</div>
			</div>
		</section>
	);
}
