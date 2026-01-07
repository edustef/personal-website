"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CopyButtonProps {
  text: string;
  className?: string;
  ariaLabel?: string;
}

export function CopyButton({
  text,
  className,
  ariaLabel = "Copy link to clipboard",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!", {
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Button
      type="button"
      onClick={handleCopy}
      size="lg"
      variant="outline"
      aria-label={copied ? "Copied!" : ariaLabel}
      title={copied ? "Copied!" : ariaLabel}
      className={`aspect-square p-0 bg-transparent hover:bg-transparent ${className || ""}`}
    >
      {copied ? (
        <Check className="size-5" aria-hidden="true" />
      ) : (
        <Copy className="size-5" aria-hidden="true" />
      )}
    </Button>
  );
}

