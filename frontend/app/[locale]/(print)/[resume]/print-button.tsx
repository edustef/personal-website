"use client";

import { Button } from "@/components/ui/button";

export default function PrintButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Button onClick={() => window.print()}>{children}</Button>;
}
