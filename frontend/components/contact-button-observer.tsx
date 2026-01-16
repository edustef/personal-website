"use client";

import whatsappLogo from "@/assets/images/whatsapp-logo.png";
import { Button } from "@/components/ui/button";
import { trackContactEvent } from "@/lib/tracking";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { useEffect, useState } from "react";

const HERO_CONTACT_BUTTON_ID = "hero-contact-button";

export function FloatingContactButton({
  contactMeText,
  contactUrl,
}: {
  contactMeText: string;
  contactUrl: string;
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
        className="size-12 shadow-lg rounded-full bg-[#25d366]"
      >
        <a
          href={contactUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={contactMeText}
          onClick={trackContactEvent}
        >
          <Image
            fill
            src={whatsappLogo}
            alt="WhatsApp"
            className="object-cover p-3"
          />
        </a>
      </Button>
    </div>
  );
}

export { HERO_CONTACT_BUTTON_ID };
