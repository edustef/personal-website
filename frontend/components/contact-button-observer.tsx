"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const HERO_CONTACT_BUTTON_ID = "hero-contact-button";

export function FloatingContactButton({
	contactMeText,
	contactUrl,
}: {
	contactMeText: string;
	contactUrl: string;
}) {
	const [showContactButton, setShowContactButton] = useState(false);
	const isMobile = useIsMobile();

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

	if (!isMobile || !showContactButton) return null;

	return (
		<div className="fixed bottom-6 right-6 z-50 md:hidden">
			<Button asChild size="icon-lg" variant="default" className="shadow-lg rounded-full">
				<a
					href={contactUrl}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={contactMeText}
				>
					<MessageCircle className="size-6" />
				</a>
			</Button>
		</div>
	);
}

export { HERO_CONTACT_BUTTON_ID };

