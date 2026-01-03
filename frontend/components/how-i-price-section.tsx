import { Check, Clock, Euro } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const packages = ["launch", "growth", "custom"] as const;
const addOns = ["seo", "store", "multiLanguage", "analytics"] as const;

export default async function HowIPriceSection() {
	const locale = await getLocale();
	const t = await getTranslations({ locale, namespace: "howIPrice" });

	return (
		<section id="how-i-price" className="py-24 md:py-32">
			<div className="mx-auto max-w-6xl px-4">
				<div className="mb-16 text-center">
					<p className="text-primary mb-3 font-medium uppercase tracking-wider">
						{t("label")}
					</p>
					<h2 className="text-foreground mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
						<a
							href="#how-i-price"
							className="hover:text-primary transition-colors"
						>
							{t("headline")}
						</a>
					</h2>
					<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
						{t("subtitle")}
					</p>
				</div>

				<div className="mb-16">
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
						{packages.map((pkg) => {
							const isPopular = pkg === "growth";
							const features = t.raw(`${pkg}.features`) as string[];

							return (
								<Card
									key={pkg}
									className={cn(
										"relative flex flex-col rounded-2xl",
										isPopular && "border-primary/50 lg:scale-105",
									)}
								>
									{isPopular && (
										<div className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-sm font-medium">
											{t("packages.mostPopular")}
										</div>
									)}
									<CardContent className="p-6">
										<div className="mb-4">
											<h4 className="text-foreground mb-2 text-xl font-semibold">
												{t(`${pkg}.title`)}
											</h4>
											<p className="text-muted-foreground mb-3">
												{t(`${pkg}.bestFor`)}
											</p>
											<p className="text-muted-foreground leading-relaxed">
												{t(`${pkg}.description`)}
											</p>
										</div>

										<div className="mb-6 space-y-3">
											<p className="text-foreground font-medium">
												{t("packages.whatYouGet")}:
											</p>
											<ul className="space-y-2">
												{features.map((feature) => (
													<li
														key={`${pkg}-${feature}`}
														className="text-muted-foreground flex items-start gap-2"
													>
														<Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
														<span>{feature}</span>
													</li>
												))}
											</ul>
										</div>
									</CardContent>

									<CardFooter className="mt-auto border-t pt-6">
										<div className="grid w-full grid-cols-1 gap-4">
											<div className="flex items-center gap-3">
												<div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
													<Clock className="h-5 w-5" />
												</div>
												<div className="flex-1">
													<p className="text-muted-foreground text-xs uppercase tracking-wide">
														{t("packages.timeline")}
													</p>
													<p className="text-foreground text-sm font-semibold">
														{t(`${pkg}.timeline`)}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-3">
												<div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
													<Euro className="h-5 w-5" />
												</div>
												<div className="flex-1">
													<p className="text-muted-foreground text-xs uppercase tracking-wide">
														{t("packages.investment")}
													</p>
													<p className="text-foreground text-lg font-bold">
														{t(`${pkg}.investment`)}
													</p>
												</div>
											</div>
										</div>
									</CardFooter>
								</Card>
							);
						})}
					</div>
				</div>

				<div className="flex flex-col items-center">
					<h3 className="text-foreground mb-4 text-2xl font-semibold">
						{t("addOns.title")}
					</h3>
					<p className="text-muted-foreground mb-8">{t("addOns.subtitle")}</p>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
						{addOns.map((addOn) => (
							<Card key={addOn} className="rounded-xl">
								<CardContent className="p-5">
									<h4 className="text-foreground mb-2 font-semibold">
										{t(`addOns.${addOn}.title`)}
									</h4>
									<p className="text-muted-foreground mb-3 leading-relaxed">
										{t(`addOns.${addOn}.benefit`)}
									</p>
									<p className="text-primary font-semibold">
										{t(`addOns.${addOn}.price`)}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
