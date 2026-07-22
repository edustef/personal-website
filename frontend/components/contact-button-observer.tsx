"use client";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { getWhatsAppUrl } from "@/lib/utils";
import { useEffect, useState } from "react";

const HERO_CONTACT_BUTTON_ID = "hero-contact-button";
const whatsappUrl = getWhatsAppUrl(undefined);

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
    <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-50 md:hidden">
      <Button
        asChild
        variant="default"
        className="size-12 shadow-lg rounded-full"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={contactMeText}
        >
          <WhatsAppIcon className="size-5" />
        </a>
      </Button>
    </div>
  );
}

export { HERO_CONTACT_BUTTON_ID };
