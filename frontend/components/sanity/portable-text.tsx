/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import {
	PortableText,
	type PortableTextComponents,
	type PortableTextBlock,
} from "next-sanity";

import ResolvedLink from "@/components/sanity/resolved-link";
import { BlockContent } from "@/sanity.types";

const componentBlocks = {
	h1: ({ children }) => (
		<h1 className="group relative text-pretty text-3xl md:text-5xl">
			{children}
		</h1>
	),
	h2: ({ children, value }) => {
		// Add an anchor to the h2
		return (
			<h2 className="group relative">
				{children}
				<a
					href={`#${value?._key}`}
					className="absolute top-0 bottom-0 left-0 -ml-6 flex items-center opacity-0 transition-opacity group-hover:opacity-100"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
						/>
					</svg>
				</a>
			</h2>
		);
	},
	normal: ({ children }) => (
		<p className="text-pretty text-md md:text-xl">{children}</p>
	),
} satisfies PortableTextComponents["block"];

const componentMarks: PortableTextComponents["marks"] = {
	link: ({ children, value: link }) => {
		return <ResolvedLink link={link}>{children}</ResolvedLink>;
	},
} satisfies PortableTextComponents["marks"];

export default function CustomPortableText({
	className,
	value,
	blocks,
	marks,
}: {
	className?: string;
	value: BlockContent;
	blocks?: PortableTextComponents["block"];
	marks?: PortableTextComponents["marks"];
}) {
	return (
		<div
			className={["prose prose-a:text-brand", className]
				.filter(Boolean)
				.join(" ")}
		>
			<PortableText
				components={{
					block: {
						...componentBlocks,
						...blocks,
					},
					marks: {
						...componentMarks,
						...marks,
					},
				}}
				value={value}
			/>
		</div>
	);
}
