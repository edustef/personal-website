"use client";

import { useRive } from "@rive-app/react-canvas";


export function AnimatedLogo() {
  const { RiveComponent } = useRive({
    src: "/animations/eduard-stefan-logo.riv",
    autoplay: true,
  });

  return <RiveComponent />;
}
