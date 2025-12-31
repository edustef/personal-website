import { getBaseUrl } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import homeOpengraphEn from "@/assets/images/home-opengraph-en.png";
import homeOpengraphEs from "@/assets/images/home-opengraph-es.png";
import homeOpengraphRo from "@/assets/images/home-opengraph-ro.png";

export type LocalizedSettingsMetadata = {
	title: string;
	description?: string;
	ogImage?: {
		url: string;
		width: number;
		height: number;
		alt: string;
	};
	metadataBase?: URL;
};

const ogImages = {
	en: homeOpengraphEn,
	es: homeOpengraphEs,
	ro: homeOpengraphRo,
};

export async function getLocalizedSettingsMetadata(
	locale: string,
): Promise<LocalizedSettingsMetadata> {
	const t = await getTranslations({ locale, namespace: "settings.seo" });

	const title = t("title");
	const description = t("description");
	const ogImage = ogImages[locale as keyof typeof ogImages] || ogImages.en;

	return {
		title,
		description,
		ogImage: {
			url: ogImage.src,
			width: ogImage.width,
			height: ogImage.height,
			alt: description || title,
		},
		metadataBase: new URL(getBaseUrl()),
	};
}

export function getCanonicalUrl(locale: string, path: string = ""): string {
	const baseUrl = getBaseUrl();
	const localePath = `/${locale}`;

	let cleanPath = path;
	if (path === "/" || path === "") {
		cleanPath = "";
	} else if (!path.startsWith("/")) {
		cleanPath = `/${path}`;
	}

	const url = `${baseUrl}${localePath}${cleanPath}`;
	return url;
}
