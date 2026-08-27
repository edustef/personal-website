"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import styles from "./theme-toggle.module.css";

const themeOrder = ["light", "dark", "system"] as const;

type Theme = (typeof themeOrder)[number];

export function ModeToggle() {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const transitionTimeout = React.useRef<number | null>(null);

  React.useEffect(() => {
    setMounted(true);

    return () => {
      if (transitionTimeout.current) {
        window.clearTimeout(transitionTimeout.current);
      }
      document.documentElement.classList.remove("theme-changing");
    };
  }, []);

  const changeTheme = React.useCallback(
    (nextTheme: string) => {
      const root = document.documentElement;

      root.classList.add("theme-changing");
      setTheme(nextTheme);

      if (transitionTimeout.current) {
        window.clearTimeout(transitionTimeout.current);
      }

      transitionTimeout.current = window.setTimeout(() => {
        root.classList.remove("theme-changing");
        transitionTimeout.current = null;
      }, 220);
    },
    [setTheme]
  );

  const currentTheme: Theme = themeOrder.includes(theme as Theme)
    ? (theme as Theme)
    : "dark";
  const nextTheme =
    themeOrder[(themeOrder.indexOf(currentTheme) + 1) % themeOrder.length];
  const systemTheme = resolvedTheme === "light" ? "light" : "dark";

  return (
    <Button
      type="button"
      variant="utility"
      size="icon"
      onClick={() => changeTheme(nextTheme)}
      data-theme={mounted ? currentTheme : undefined}
      aria-label={`Current theme: ${currentTheme}. Switch to ${nextTheme}.`}
      title={`${currentTheme[0].toUpperCase()}${currentTheme.slice(1)} theme`}
      className={styles.toggleButton}
    >
      <span aria-hidden="true" className={styles.iconStack}>
        <Sun
          className={`${styles.icon} ${styles.stateIcon} ${styles.lightIcon}`}
        />
        <Moon
          className={`${styles.icon} ${styles.stateIcon} ${styles.darkIcon}`}
        />
        <span
          className={`${styles.icon} ${styles.stateIcon} ${styles.systemIcon}`}
        >
          <Monitor className={styles.monitorIcon} />
          <span className={styles.systemThemeBadge}>
            <Sun
              className={`${styles.icon} ${styles.miniIcon} ${styles.sun}`}
            />
            <Moon
              className={`${styles.icon} ${styles.miniIcon} ${styles.moon}`}
            />
          </span>
        </span>
      </span>
      <span className="sr-only">
        {currentTheme === "system" ? `System is currently ${systemTheme}.` : ""}
      </span>
    </Button>
  );
}
