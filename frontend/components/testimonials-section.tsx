import { testimonials, type Testimonial } from "@/lib/data/testimonials";
import { getTranslations, getLocale } from "next-intl/server";
import { Quote } from "lucide-react";

type TestimonialsSectionProps = {
	testimonials?: Testimonial[];
};

export default async function TestimonialsSection({
	testimonials: testimonialsProp,
}: TestimonialsSectionProps) {
	const testimonialsToDisplay = testimonialsProp || testimonials;
	if (!testimonialsToDisplay || testimonialsToDisplay.length === 0) {
		return null;
	}

	const locale = await getLocale();
	const t = await getTranslations({ locale, namespace: "testimonials" });

	return (
		<section className="py-24 md:py-32">
			<div className="mx-auto max-w-6xl px-4">
				<div className="mb-16 text-center">
					<p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
						{t("label")}
					</p>
					<h2 className="text-foreground mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
						{t("headline")}
					</h2>
					<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
						{t("subtitle")}
					</p>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{testimonialsToDisplay.map((testimonial, index) => {
						const isLarge = index === 0;

						return (
							<article
								key={testimonial._id}
								className={`rounded-2xl border border-border bg-card p-6 md:p-8 ${isLarge ? "md:col-span-2" : ""}`}
							>
								<Quote className="text-primary/20 mb-4 h-8 w-8" />

								<blockquote className="mb-6">
									<p
										className={`text-foreground leading-relaxed ${isLarge ? "text-lg md:text-xl" : "text-base"}`}
									>
										"{t(testimonial.quoteKey)}"
									</p>
								</blockquote>

								<footer className="flex items-center gap-4">
									<div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold">
										{testimonial.author
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</div>
									<div>
										<p className="text-foreground font-semibold">
											{testimonial.author}
										</p>
										<p className="text-muted-foreground text-sm">
											{testimonial.role}, {testimonial.company}
										</p>
									</div>
								</footer>
							</article>
						);
					})}
				</div>
			</div>
		</section>
	);
}
