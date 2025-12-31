"use client";

import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type PixelatedImageThemeProps = {
	src: string;
	width?: number;
	height?: number;
	cellSize?: number;
	dotScale?: number;
	shape?: "circle" | "square";
	dropoutStrength?: number;
	interactive?: boolean;
	distortionStrength?: number;
	distortionRadius?: number;
	distortionMode?: "repel" | "attract" | "swirl";
	followSpeed?: number;
	jitterStrength?: number;
	jitterSpeed?: number;
	sampleAverage?: boolean;
	tintStrength?: number;
};

export function PixelatedImageTheme(props: PixelatedImageThemeProps) {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDark = mounted && theme === "dark";

	return (
		<PixelatedCanvas
			{...props}
			backgroundColor={isDark ? "#0a0a0a" : "#fff"}
			tintColor={isDark ? "#e5e5e5" : "#FFFFFF"}
		/>
	);
}

