export type Certificate = {
	_id: string;
	title: string;
	dateIssued: string;
	link: string;
	descriptionKey: string;
};

export const certificates: Certificate[] = [
	{
		_id: "a0e1ad88-72ae-4bc4-a8c5-ab8b139d6533",
		title: "Responsive Web Design",
		dateIssued: "2019-12-28",
		link: "https://www.freecodecamp.org/certification/edustef/responsive-web-design",
		descriptionKey: "certificates.cert-1.description",
	},
	{
		_id: "4baf555f-1be8-45a2-98fe-ddaeeea25182",
		title: "JavaScript Algorithms and Data Structures",
		dateIssued: "2021-10-08",
		link: "https://www.freecodecamp.org/certification/edustef/javascript-algorithms-and-data-structures",
		descriptionKey: "certificates.cert-2.description",
	},
	{
		_id: "e4d2bb74-a579-4aec-96fa-adfcf7d49933",
		title: "NodeJS - The Complete Course",
		dateIssued: "2021-07-21",
		link: "https://www.udemy.com/certificate/UC-de2cd267-45b9-4bb9-a21e-30d989552a55/",
		descriptionKey: "certificates.cert-3.description",
	},
	{
		_id: "45c91944-866a-46c7-9a1f-fdc11460adba",
		title: "React - The Complete Guide",
		dateIssued: "2021-08-18",
		link: "https://www.udemy.com/certificate/UC-59caf68b-de30-4557-8b7b-aa06d6c70d49/",
		descriptionKey: "certificates.cert-4.description",
	},
	{
		_id: "5d179a2f-74d2-4b5a-8f1d-194036f10c61",
		title: "The Web Development Bootcamp",
		dateIssued: "2019-11-16",
		link: "https://www.udemy.com/certificate/UC-JY8G69HR/",
		descriptionKey: "certificates.cert-5.description",
	},
].sort(
	(a, b) => new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime(),
);
