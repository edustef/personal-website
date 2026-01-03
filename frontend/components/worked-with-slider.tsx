"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { cn } from "@/lib/utils";

const skills = [
	{
		id: "figma",
		name: "Figma",
	},
	{
		id: "nextjs",
		name: "Next.js",
		classNames: "w-12 md:w-20",
	},
	{
		id: "openai",
		name: "OpenAI",
	},
	{
		id: "react",
		name: "React",
	},
	{
		id: "sanity",
		name: "Sanity",
	},
	{
		id: "supabase",
		name: "Supabase",
		classNames: "w-12 md:w-32",
	},
	{
		id: "tailwindcss",
		name: "Tailwind CSS",
		classNames: "w-12 md:w-32",
	},
	{
		id: "vercel",
		name: "Vercel",
	},
	{
		id: "aiSdk",
		name: "AI SDK",
		classNames: "w-12 md:w-16",
	},
	{
		id: "convex",
		name: "Convex",
		classNames: "w-12 md:w-32",
	},
];

export function WorkedWithSlider() {
	const { theme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const currentTheme = resolvedTheme || theme || "dark";
	const isDark = mounted ? currentTheme === "dark" : true;

	return (
		<motion.div
			className="relative h-10 md:h-24  w-full overflow-hidden"
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 2.2,
				delay: 0.3,
				ease: [0.25, 1, 0.25, 1],
			}}
		>
			<InfiniteSlider
				className="flex h-full w-full items-center"
				duration={30}
				gap={48}
			>
				{skills.map((skill) => {
					const theme = isDark ? "dark" : "light";
					const src = `/skills/${skill.id}-${theme}.svg`;
					return (
						<div
							key={skill.id}
							className={cn(
								"flex items-center justify-center w-16 md:w-24",
								skill.classNames,
							)}
						>
							<Image src={src} alt={skill.name} width={228} height={128} />
						</div>
					);
				})}
			</InfiniteSlider>
			<ProgressiveBlur
				className="pointer-events-none absolute top-0 left-0 h-full w-12 md:w-24"
				direction="left"
				blurIntensity={0.5}
			/>
			<ProgressiveBlur
				className="pointer-events-none absolute top-0 right-0 h-full w-12 md:w-24"
				direction="right"
				blurIntensity={0.5}
			/>
		</motion.div>
	);
}
