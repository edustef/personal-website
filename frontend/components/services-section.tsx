import { Globe, Headphones, Layers, Palette, Rocket, Zap } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { BGPattern } from "@/components/ui/bg-pattern";
import { Card, CardContent } from "@/components/ui/card";
import { type Service, services } from "@/lib/data/services";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
	layers: Layers,
	zap: Zap,
	rocket: Rocket,
	palette: Palette,
	headphones: Headphones,
	globe: Globe,
};

const patternVariants: Array<"dots" | "diagonal-stripes" | "grid"> = [
	"diagonal-stripes",
	"dots",
	"grid",
];

function getPatternForService(
	index: number,
): "dots" | "diagonal-stripes" | "grid" {
	const patternIndex = index % patternVariants.length;
	return patternVariants[patternIndex];
}

type ServicesSectionProps = {
	services?: Service[];
};

export default async function ServicesSection({
	services: servicesProp,
}: ServicesSectionProps) {
	const servicesToDisplay = servicesProp || services;
	if (!servicesToDisplay || servicesToDisplay.length === 0) {
		return null;
	}

	const locale = await getLocale();
	const t = await getTranslations({ locale, namespace: "services" });

	const featuredServices = servicesToDisplay.filter((s) => s.featured);
	const otherServices = servicesToDisplay.filter((s) => !s.featured);

	return (
		<section id="services" className="py-24 md:py-32">
			<div className="mx-auto max-w-6xl px-4">
				<div className="mb-16 text-center">
					<p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
						{t("label")}
					</p>
					<h2 className="text-foreground mb-4 text-3xl tracking-tight md:text-4xl">
						<a
							href="#services"
							className="hover:text-primary transition-colors"
						>
							{t("headline")}
						</a>
					</h2>
					<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
						{t("subtitle")}
					</p>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					{featuredServices.map((service, index) => {
						const Icon = iconMap[service.icon] || Layers;
						const patternVariant = getPatternForService(index);

						return (
							<Card
								key={service._id}
								className={cn(
									"isolate relative overflow-hidden rounded-2xl bg-card/95 backdrop-blur-sm lg:col-span-2 lg:row-span-2",
								)}
							>
								<BGPattern variant={patternVariant} mask="fade-edges" />
								<CardContent className="relative p-8">
									<Icon className="size-10 mb-4" />
									<h3 className="text-foreground mb-3 text-xl font-semibold">
										{t(service.titleKey)}
									</h3>
									<p className="text-muted-foreground leading-relaxed">
										{t(service.descriptionKey)}
									</p>
								</CardContent>
							</Card>
						);
					})}

					{otherServices.map((service, index) => {
						const Icon = iconMap[service.icon] || Layers;
						const patternVariant = getPatternForService(
							featuredServices.length + index,
						);

						return (
							<Card
								key={service._id}
								className="relative overflow-hidden rounded-2xl bg-card/95 backdrop-blur-sm"
							>
								<BGPattern
									variant={patternVariant}
									mask="fade-edges"
									size={20}
								/>
								<CardContent className="relative p-6">
									<Icon className="size-8 mb-4" />
									<h3 className="text-foreground mb-2 text-base font-semibold">
										{t(service.titleKey)}
									</h3>
									<p className="text-muted-foreground leading-relaxed">
										{t(service.descriptionKey)}
									</p>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
}
