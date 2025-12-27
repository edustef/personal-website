export type Testimonial = {
	_id: string;
	quoteKey: string;
	author: string;
	role: string;
	company: string;
	avatar?: string;
};

export const testimonials: Testimonial[] = [
	{
		_id: "test-1",
		quoteKey: "test-1.quote",
		author: "Marcus Chen",
		role: "CEO",
		company: "TechFlow Solutions",
	},
	{
		_id: "test-2",
		quoteKey: "test-2.quote",
		author: "Sarah Mitchell",
		role: "Co-Founder",
		company: "Finova",
	},
	{
		_id: "test-3",
		quoteKey: "test-3.quote",
		author: "David Park",
		role: "Product Director",
		company: "ScaleUp Agency",
	},
	{
		_id: "test-4",
		quoteKey: "test-4.quote",
		author: "Elena Rodriguez",
		role: "Founder",
		company: "Bloom & Co",
	},
];
