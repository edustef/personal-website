import { useMobileContext } from "@/contexts/mobile-context";

export function useIsMobile() {
  const { isMobile } = useMobileContext();
  return isMobile;
}
