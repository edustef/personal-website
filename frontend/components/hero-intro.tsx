"use client";

import { cn } from "@/lib/utils";
import { AnimatedContainer } from "@/components/ui/animated-container";

type CommonProps = {
	children: React.ReactNode;
	className?: string;
};

export function HeroIntro({ className, children }: CommonProps) {
	return (
		<section
			className={cn(
				"mx-auto flex w-full max-w-6xl flex-1 flex-col justify-between gap-16 md:justify-start",
				className,
			)}
		>
			{children}
		</section>
	);
}

export const HeroIntroContent = ({ children, className }: CommonProps) => {
	return (
		<AnimatedContainer
			className={cn("max-w-2xl flex flex-col gap-4", className)}
			duration={3}
			delay={0.2}
			ease="smooth"
		>
			{children}
		</AnimatedContainer>
	);
};

export const HeroIntroSocialLinks = ({ children, className }: CommonProps) => {
	return (
		<AnimatedContainer
			className={cn("flex flex-row gap-4", className)}
			duration={3}
			delay={0.2}
			ease="smooth"
		>
			{children}
		</AnimatedContainer>
	);
};

export const HeroIntroCtaButtons = ({ children, className }: CommonProps) => {
	return (
		<AnimatedContainer
			className={cn("flex flex-col gap-4 md:flex-row", className)}
		>
			{children}
		</AnimatedContainer>
	);
};
