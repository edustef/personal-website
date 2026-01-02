"use client";

import { motion } from "motion/react";
import Image from "next/image";
import heroImage1 from "@/assets/images/hero-image-1.jpeg";
import heroImage2 from "@/assets/images/hero-image-2.jpeg";
import heroImage3 from "@/assets/images/hero-image-3.jpeg";

const imageVariants = {
	initial: {
		opacity: 0,
		scale: 0.95,
	},
	animate: {
		opacity: 1,
		scale: 1,
	},
};

const transition = {
	duration: 0.6,
	ease: [0.16, 1, 0.3, 1] as const,
};

export function HeroImages() {
	return (
		<div className="lg:h-full grid grid-cols-2 gap-3 lg:grid-cols-3 lg:grid-rows-2 lg:gap-4">
			<motion.div
				className="group relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-card lg:col-span-2 lg:row-span-2 lg:aspect-auto"
				variants={imageVariants}
				initial="initial"
				animate="animate"
				transition={{ ...transition, delay: 0.2 }}
			>
				<Image
					src={heroImage1}
					alt="Development dashboard and analytics"
					fill
					priority
					fetchPriority="high"
					className="object-cover"
					sizes="(max-width: 1024px) 100vw, 66vw"
					quality={85}
				/>
			</motion.div>
			<motion.div
				className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-card lg:col-span-1 lg:row-span-1 lg:aspect-auto"
				variants={imageVariants}
				initial="initial"
				animate="animate"
				transition={{ ...transition, delay: 0.4 }}
			>
				<Image
					src={heroImage2}
					alt="Code editor with modern IDE"
					fill
					fetchPriority="low"
					className="object-cover"
					sizes="(max-width: 1024px) 50vw, 33vw"
					quality={80}
					loading="lazy"
				/>
			</motion.div>
			<motion.div
				className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-card lg:col-span-1 lg:row-span-1 lg:aspect-auto"
				variants={imageVariants}
				initial="initial"
				animate="animate"
				transition={{ ...transition, delay: 0.6 }}
			>
				<Image
					src={heroImage3}
					alt="API documentation and development tools"
					fill
					fetchPriority="low"
					className="object-cover"
					sizes="(max-width: 1024px) 50vw, 33vw"
					quality={80}
					loading="lazy"
				/>
			</motion.div>
		</div>
	);
}
