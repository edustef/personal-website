"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { locales } from "@/i18n/routing";
import { usePathname } from "@/i18n/navigation";

export function LanguageToggle({
	currentLocale,
	className,
}: {
	currentLocale: string;
	className?: string;
}) {
	const pathname = usePathname();
	const currentLocaleTitle =
		locales.find((locale) => locale.id === currentLocale)?.title ||
		currentLocale.toUpperCase();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className={className}>
					{currentLocaleTitle}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuRadioGroup value={currentLocale}>
					{locales.map(({ id, title }) => (
						<DropdownMenuRadioItem key={id} value={id}>
							<Link href={pathname} locale={id} className="block w-full">
								{title}
							</Link>
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
