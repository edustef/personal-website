import citadellaDesktop from "@/assets/projects/citadella/citadella-desktop.png";
import citadellaMobile from "@/assets/projects/citadella/citadella-mobile.png";
import barbershopDesktop from "@/assets/projects/barbershop/barbershop-desktop.png";
import barbershopMobile from "@/assets/projects/barbershop/barbershop-mobile.png";
import omniDesktop from "@/assets/projects/omni/omni-shopping-app-desktop.png";
import omniMobile from "@/assets/projects/omni/omni-shopping-app-mobile.png";
import type { StaticImageData } from "next/image";

type ProjectImages = {
  desktop: StaticImageData;
  mobile: StaticImageData;
};

export const projectImages: Record<string, ProjectImages> = {
  citadella: {
    desktop: citadellaDesktop,
    mobile: citadellaMobile,
  },
  barbershop: {
    desktop: barbershopDesktop,
    mobile: barbershopMobile,
  },
  omnishoppingapp: {
    desktop: omniDesktop,
    mobile: omniMobile,
  },
};

export function getProjectImages(projectId: string): ProjectImages | null {
  return projectImages[projectId] || null;
}
