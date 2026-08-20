"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import styles from "./theme-toggle.module.css";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const transitionTimeout = React.useRef<number | null>(null);

  React.useEffect(() => {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="utility"
          size="icon"
          className="transition-colors duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]"
        >
          <Sun className={`size-[1.2rem] ${styles.icon} ${styles.sun}`} />
          <Moon className={`size-[1.2rem] ${styles.icon} ${styles.moon}`} />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={theme || "dark"}
          onValueChange={changeTheme}
        >
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
