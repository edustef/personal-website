"use client";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type SpotlightProps = {
  gradientFirst?: string;
  gradientSecond?: string;
  gradientThird?: string;
  translateY?: number;
  width?: number;
  height?: number;
  smallWidth?: number;
  duration?: number;
  xOffset?: number;
};

const lightGradients = {
  gradientFirst:
    "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(0, 0%, 50%, .08) 0, hsla(0, 0%, 40%, .04) 50%, hsla(0, 0%, 30%, 0) 80%)",
  gradientSecond:
    "radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 50%, .06) 0, hsla(0, 0%, 40%, .03) 80%, transparent 100%)",
  gradientThird:
    "radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 50%, .05) 0, hsla(0, 0%, 40%, .02) 80%, transparent 100%)",
};

const darkGradients = {
  gradientFirst:
    "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(0, 0%, 100%, .08) 0, hsla(0, 0%, 90%, .04) 50%, hsla(0, 0%, 80%, 0) 80%)",
  gradientSecond:
    "radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 100%, .06) 0, hsla(0, 0%, 90%, .03) 80%, transparent 100%)",
  gradientThird:
    "radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 100%, .05) 0, hsla(0, 0%, 90%, .025) 80%, transparent 100%)",
};

export const Spotlight = ({
  gradientFirst,
  gradientSecond,
  gradientThird,
  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 7,
  xOffset = 100,
}: SpotlightProps = {}) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const gradients = isDark ? darkGradients : lightGradients;

  const finalGradientFirst = gradientFirst || gradients.gradientFirst;
  const finalGradientSecond = gradientSecond || gradients.gradientSecond;
  const finalGradientThird = gradientThird || gradients.gradientThird;
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 1.5,
      }}
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
    >
      <motion.div
        animate={{
          x: [0, xOffset, 0],
        }}
        transition={{
          duration,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute top-0 left-0 z-40 h-screen w-screen"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-45deg)`,
            background: finalGradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0"
        />

        <div
          style={{
            transform: "rotate(-45deg) translate(5%, -50%)",
            background: finalGradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />

        <div
          style={{
            transform: "rotate(-45deg) translate(-180%, -70%)",
            background: finalGradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />
      </motion.div>

      <motion.div
        animate={{
          x: [0, -xOffset, 0],
        }}
        transition={{
          duration,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute top-0 right-0 z-40 h-screen w-screen"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(45deg)`,
            background: finalGradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0"
        />

        <div
          style={{
            transform: "rotate(45deg) translate(-5%, -50%)",
            background: finalGradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />

        <div
          style={{
            transform: "rotate(45deg) translate(180%, -70%)",
            background: finalGradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />
      </motion.div>
    </motion.div>
  );
};
