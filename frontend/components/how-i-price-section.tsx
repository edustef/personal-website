import { Check, Clock, Euro } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const packages = ["launch", "growth", "custom"] as const;
const addOns = ["seo", "store", "multiLanguage", "analytics"] as const;

export default async function HowIPriceSection() {
	const locale = await getLocale();
	const t = await getTranslations({ locale, namespace: "howIPrice" });

	const formatPrice = (amount: number): string => {
		const formatter = new Intl.NumberFormat(locale, {
			style: "currency",
			currency: "EUR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		});
		return `${formatter.format(amount)}+`;
	};

	return (
		<section id="how-i-price" className="py-12 md:py-16">
			<div className="mx-auto max-w-6xl px-4">
				<AnimatedContainer
					trigger="scroll"
					fadeDirection="up"
					className="mb-16 text-center"
				>
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
				</AnimatedContainer>

				<div className="mb-16">
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
						{packages.map((pkg, index) => {
							const isPopular = pkg === "growth";
							const features = t.raw(`${pkg}.features`) as string[];

							return (
								<AnimatedContainer
									key={pkg}
									trigger="scroll"
									fadeDirection="up"
									staggerIndex={index}
									staggerDelay={0.12}
									className={cn(isPopular && "lg:scale-105")}
								>
									<Card
										className={cn(
											"relative flex h-full flex-col rounded-2xl",
											isPopular && "border-primary/50",
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
															<Check className="text-primary mt-1 h-4 w-4 shrink-0" />
															<span>{feature}</span>
														</li>
													))}
												</ul>
											</div>
										</CardContent>

										<CardFooter className="mt-auto border-t pt-6">
											<div className="grid w-full grid-cols-1 gap-4">
												<div className="flex items-center gap-3">
													<div className="text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
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
													<div className="text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
														<Euro className="h-5 w-5" />
													</div>
													<div className="flex-1">
														<p className="text-muted-foreground text-xs uppercase tracking-wide">
															{t("packages.investment")}
														</p>
														<p className="text-foreground text-lg font-bold">
															{pkg === "custom"
																? t(`${pkg}.investment`)
																: formatPrice(
																		t.raw(`${pkg}.investmentAmount`) as number,
																	)}
														</p>
													</div>
												</div>
											</div>
										</CardFooter>
									</Card>
								</AnimatedContainer>
							);
						})}
					</div>
				</div>

				<AnimatedContainer
					trigger="scroll"
					fadeDirection="up"
					className="flex flex-col items-center"
				>
					<h3 className="text-foreground mb-4 text-2xl font-semibold">
						{t("addOns.title")}
					</h3>
					<p className="text-muted-foreground mb-8">{t("addOns.subtitle")}</p>
				</AnimatedContainer>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					{addOns.map((addOn, index) => (
						<AnimatedContainer
							key={addOn}
							trigger="scroll"
							fadeDirection="up"
							staggerIndex={index}
							staggerDelay={0.08}
						>
							<Card className="h-full rounded-xl">
								<CardContent className="p-5">
									<h4 className="text-foreground text-xl mb-2 font-semibold">
										{t(`addOns.${addOn}.title`)}
									</h4>
									<p className="text-muted-foreground mb-3 leading-relaxed">
										{t(`addOns.${addOn}.benefit`)}
									</p>
								</CardContent>
								<CardFooter className="mt-auto pt-6">
									<p className="text-primary text-lg font-semibold">
										{formatPrice(
											t.raw(`addOns.${addOn}.priceAmount`) as number,
										)}
									</p>
								</CardFooter>
							</Card>
						</AnimatedContainer>
					))}
				</div>
			</div>
		</section>
	);
}
