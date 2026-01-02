export type FAQ = {
	_id: string;
	questionKey: string;
	answerKey: string;
	order: number;
};

export const faqs: FAQ[] = [
	{
		_id: "faq-1",
		questionKey: "faq-1.question",
		answerKey: "faq-1.answer",
		order: 0,
	},
	{
		_id: "faq-2",
		questionKey: "faq-2.question",
		answerKey: "faq-2.answer",
		order: 1,
	},
	{
		_id: "faq-3",
		questionKey: "faq-3.question",
		answerKey: "faq-3.answer",
		order: 2,
	},
	{
		_id: "faq-4",
		questionKey: "faq-4.question",
		answerKey: "faq-4.answer",
		order: 3,
	},
	{
		_id: "faq-5",
		questionKey: "faq-5.question",
		answerKey: "faq-5.answer",
		order: 4,
	},
];

