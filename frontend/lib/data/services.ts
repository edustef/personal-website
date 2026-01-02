export type Service = {
	_id: string;
	titleKey: string;
	descriptionKey: string;
	icon: string;
	featured: boolean;
};

export const services: Service[] = [
	{
		_id: "svc-1",
		titleKey: "svc-1.title",
		descriptionKey: "svc-1.description",
		icon: "layers",
		featured: true,
	},
	{
		_id: "svc-4",
		titleKey: "svc-4.title",
		descriptionKey: "svc-4.description",
		icon: "rocket",
		featured: false,
	},
	{
		_id: "svc-7",
		titleKey: "svc-7.title",
		descriptionKey: "svc-7.description",
		icon: "globe",
		featured: false,
	},
	{
		_id: "svc-3",
		titleKey: "svc-3.title",
		descriptionKey: "svc-3.description",
		icon: "zap",
		featured: false,
	},
	{
		_id: "svc-5",
		titleKey: "svc-5.title",
		descriptionKey: "svc-5.description",
		icon: "palette",
		featured: false,
	},
	{
		_id: "svc-6",
		titleKey: "svc-6.title",
		descriptionKey: "svc-6.description",
		icon: "headphones",
		featured: true,
	},
];
