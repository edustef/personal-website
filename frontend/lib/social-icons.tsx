import { Linkedin, Instagram, Github, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SocialPlatform = "LinkedIn" | "Instagram" | "GitHub" | "WhatsApp";

export const socialIconMap: Record<SocialPlatform, LucideIcon> = {
	LinkedIn: Linkedin,
	Instagram: Instagram,
	GitHub: Github,
	WhatsApp: MessageCircle,
};

export function getSocialIcon(
	platformName: string,
): LucideIcon | null {
	const normalizedName = platformName.trim() as SocialPlatform;
	return socialIconMap[normalizedName] || null;
}

