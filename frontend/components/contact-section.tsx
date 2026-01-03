import { MessageCircle } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getSocialIcon } from "@/lib/social-icons";

type SocialLink = {
	name: string;
	url: string;
};

type ContactSectionProps = {
	socialLinks?: SocialLink[];
	whatsappUrl?: string;
};

export default async function ContactSection({
	socialLinks,
	whatsappUrl,
}: ContactSectionProps) {
	const locale = await getLocale();
	const t = await getTranslations({ locale, namespace: "home" });

	const hasWhatsApp = !!whatsappUrl;
	const hasSocialLinks = socialLinks && socialLinks.length > 0;

	return (
		<section id="contact" className="py-24 md:py-32">
			<div className="mx-auto max-w-6xl px-4">
				<AnimatedContainer
					trigger="scroll"
					fadeDirection="up"
					className="mb-16 text-center"
				>
					<p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
						{t("contact.label")}
					</p>
					<h2 className="text-foreground mb-4 text-3xl tracking-tight md:text-4xl">
						<a href="#contact" className="hover:text-primary transition-colors">
							{t("contact.headline")}
						</a>
					</h2>
					<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
						{t("contact.subtitle")}
					</p>
				</AnimatedContainer>

				<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
					<AnimatedContainer
						trigger="scroll"
						fadeDirection="up"
						staggerIndex={0}
						staggerDelay={0.1}
						className="w-full sm:w-auto"
					>
						<Button
							asChild
							size="lg"
							variant="default"
							className="w-full"
						>
							<Link href="/start-your-project">{t("contact.ctaButton")}</Link>
						</Button>
					</AnimatedContainer>

					{hasWhatsApp && (
						<AnimatedContainer
							trigger="scroll"
							fadeDirection="up"
							staggerIndex={1}
							staggerDelay={0.1}
							className="w-full sm:w-auto"
						>
							<Button
								asChild
								size="lg"
								variant="outline"
								className="w-full"
							>
								<a
									href={whatsappUrl}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={t("contact.whatsappLabel")}
								>
									<MessageCircle className="size-5" />
									WhatsApp
								</a>
							</Button>
						</AnimatedContainer>
					)}

					{hasSocialLinks && (
						<AnimatedContainer
							trigger="scroll"
							fadeDirection="up"
							staggerIndex={2}
							staggerDelay={0.1}
							className="flex gap-2"
						>
							{socialLinks.map((link) => {
								const Icon = getSocialIcon(link.name);
								return (
									<Button
										key={link.name}
										asChild
										size="lg"
										variant="outline"
										className="aspect-square p-0"
									>
										<a
											href={link.url}
											target="_blank"
											rel="noopener noreferrer"
											aria-label={link.name}
										>
											{Icon && <Icon className="size-5" />}
										</a>
									</Button>
								);
							})}
						</AnimatedContainer>
					)}
				</div>
			</div>
		</section>
	);
}
