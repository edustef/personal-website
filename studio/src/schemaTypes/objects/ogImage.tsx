import { defineField, defineType } from "sanity";

export const ogImage = defineType({
  name: "ogImage",
  title: "Open Graph Image",
  type: "image",
  description: "Displayed on social cards and search engine results.",
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
    }),
    defineField({
      name: "metadataBase",
      type: "url",
      description: (
        <a
          href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase"
          rel="noreferrer noopener"
        >
          More information
        </a>
      ),
    }),
  ],
});
