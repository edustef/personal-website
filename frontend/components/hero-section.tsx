import { getTranslations, getLocale } from "next-intl/server";
import { HighlightBadge } from "@/components/ui/highlight-badge";
import { Button } from "@/components/ui/button";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { HERO_CONTACT_BUTTON_ID } from "@/components/contact-button-observer";
import { getSocialIcon } from "@/lib/social-icons";

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

					<div className="flex flex-col gap-4 lg:flex-1 order-3 lg:order-2">
						<div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:grid-rows-2 lg:gap-4">
							<div className="group relative col-span-2 aspect-square overflow-hidden rounded-2xl border border-border bg-card transition-transform duration-300 hover:scale-105 lg:col-span-2 lg:row-span-2 lg:aspect-auto">
								<Image
									src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&q=80"
									alt="Development dashboard and analytics"
									fill
									className="object-cover"
									sizes="(max-width: 1024px) 100vw, 66vw"
								/>
							</div>
							<div className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-card transition-transform duration-300 hover:scale-105 lg:col-span-1 lg:row-span-1">
								<Image
									src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=800&fit=crop&q=80"
									alt="Code editor with modern IDE"
									fill
									className="object-cover"
									sizes="(max-width: 1024px) 50vw, 33vw"
								/>
							</div>
							<div className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-card transition-transform duration-300 hover:scale-105 lg:col-span-1 lg:row-span-1">
								<Image
									src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=800&fit=crop&q=80"
									alt="API documentation and development tools"
									fill
									className="object-cover"
									sizes="(max-width: 1024px) 50vw, 33vw"
								/>
							</div>
						</div>
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
