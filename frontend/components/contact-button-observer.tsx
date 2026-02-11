"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "@/i18n/navigation";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

const HERO_CONTACT_BUTTON_ID = "hero-contact-button";

export function FloatingContactButton({
  contactMeText,
}: {
  contactMeText: string;
}) {
  const [showContactButton, setShowContactButton] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const heroButton = document.getElementById(HERO_CONTACT_BUTTON_ID);
    if (!heroButton) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowContactButton(!entry.isIntersecting);
      },
      {
        rootMargin: "-1px 0px 0px 0px",
        threshold: 0,
      }
    );

    observer.observe(heroButton);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!isMobile || !showContactButton) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <Button
        asChild
        variant="default"
        className="size-12 shadow-lg rounded-full"
      >
        <Link href="/schedule" aria-label={contactMeText}>
          <Calendar className="size-5" />
        </Link>
      </Button>
    </div>
  );
}

export { HERO_CONTACT_BUTTON_ID };
