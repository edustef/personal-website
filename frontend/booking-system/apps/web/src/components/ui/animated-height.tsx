"use client";

import { motion } from "framer-motion";
import * as React from "react";

interface AnimatedHeightProps {
	children: React.ReactNode;
	className?: string;
}

export function AnimatedHeight({ children, className }: AnimatedHeightProps) {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [height, setHeight] = React.useState<number | "auto">("auto");

	React.useEffect(() => {
		if (!containerRef.current) return;

		const updateHeight = () => {
			if (containerRef.current) {
				setHeight(containerRef.current.offsetHeight);
			}
		};

		const resizeObserver = new ResizeObserver(updateHeight);
		resizeObserver.observe(containerRef.current);

		const mutationObserver = new MutationObserver(updateHeight);
		mutationObserver.observe(containerRef.current, {
			childList: true,
			subtree: true,
			attributes: true,
		});

		return () => {
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	}, []);

	return (
		<motion.div
			className={className}
			animate={{ height }}
			transition={{ type: "spring", bounce: 0, duration: 0.3 }}
			style={{ overflow: "hidden" }}
		>
			<div ref={containerRef}>{children}</div>
		</motion.div>
	);
}
