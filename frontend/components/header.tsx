"use client";

import { LanguageToggle } from "@/components/language-toggle";
import { ModeToggle } from "@/components/theme-toggle";
import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Link } from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { HERO_CONTACT_BUTTON_ID } from "@/components/contact-button-observer";

const AnimatedLogo = dynamic(
	() =>
		import("./animated-logo").then((mod) => ({ default: mod.AnimatedLogo })),
	{
		loading: () => <div className="size-6 md:size-8" />,
	},
);

type HeaderProps = {
	locale: string;
	className?: string;
	contactMeText: string;
	skipLinkText: string;
	navigationLabel: string;
	homeButtonLabel: string;
};

export function Header({
	locale,
	className,
	contactMeText,
	skipLinkText,
	navigationLabel,
	homeButtonLabel,
}: HeaderProps) {
	const [showContactButton, setShowContactButton] = useState(false);

	useEffect(() => {
		const heroButton = document.getElementById(HERO_CONTACT_BUTTON_ID);
		if (!heroButton) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				setShowContactButton(!entry.isIntersecting);
			},
			{
				rootMargin: "-1px 0px 0px 0px",
				threshold: 0,
			},
		);

		observer.observe(heroButton);

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<header
			className={cn(
				"fixed inset-0 z-50 flex h-16 w-full items-center px-4 md:h-20",
				className,
			)}
		>
			<a
				href="#main-content"
				className="focus-visible:bg-primary focus-visible:text-primary-foreground focus-visible:ring-offset-background sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:px-4 focus-visible:py-2 focus-visible:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
			>
				{skipLinkText}
			</a>
			<div className="container mx-auto w-full max-w-6xl">
				<div className="flex items-center justify-between gap-5">
					<Link
						aria-label={homeButtonLabel}
						className="group flex items-center gap-2 p-0 text-xl font-bold"
						href="/"
					>
						Eduard Stefan
					</Link>

					<NavigationMenu aria-label={navigationLabel}>
						<NavigationMenuList className="gap-4 md:gap-6">
							<NavigationMenuItem
								className={cn(
									"hidden md:block transition-opacity duration-200",
									showContactButton
										? "opacity-100"
										: "pointer-events-none opacity-0",
								)}
							>
								<Button asChild variant="default">
									<a
										href="https://wa.me/40775378525"
										target="_blank"
										rel="noopener noreferrer"
									>
										{contactMeText}
									</a>
								</Button>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<ModeToggle />
							</NavigationMenuItem>
							<NavigationMenuItem>
								<LanguageToggle currentLocale={locale} />
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
			</div>
		</header>
	);
}
