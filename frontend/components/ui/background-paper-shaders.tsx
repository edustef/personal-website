"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

export function BackgroundPaperShaders() {
	const theme = useTheme();
	const isDark = theme.resolvedTheme === "dark";
	const [mounted, setMounted] = useState(false);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		setMounted(true);
		setDimensions({ width: window.innerWidth, height: window.innerHeight });
	}, []);

	useEffect(() => {
		if (!mounted) return;

		let rafId: number;

		const handleResize = () => {
			if (rafId) {
				cancelAnimationFrame(rafId);
			}

			rafId = requestAnimationFrame(() => {
				setDimensions({ width: window.innerWidth, height: window.innerHeight });
			});
		};

		window.addEventListener("resize", handleResize, { passive: true });

		return () => {
			window.removeEventListener("resize", handleResize);
			if (rafId) {
				cancelAnimationFrame(rafId);
			}
		};
	}, [mounted]);

	if (!mounted || dimensions.width === 0 || dimensions.height === 0)
		return null;

	return (
		<motion.div
			className="absolute -z-10 inset-0 h-full w-full"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1 }}
		>
			<MeshGradient
				className="mask-b-from-50% mask-b-to-100%"
				width={dimensions.width}
				height={dimensions.height}
				colors={isDark ? ["#000000", "#333333"] : ["#ffffff", "#cccccc"]}
				distortion={0.2}
				swirl={0.9}
				grainMixer={0}
				grainOverlay={0}
				speed={0.9}
				rotation={90}
			/>
		</motion.div>
	);
}
