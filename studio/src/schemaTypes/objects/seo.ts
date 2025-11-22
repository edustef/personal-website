import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "SEO Title",
      description: "Title used for SEO and browser tabs",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "description",
      title: "SEO Description",
      description: "Meta description for search engines",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      description: "Image displayed on social cards and search engine results",
      type: "internationalizedArrayOgImage",
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: "alt",
        },
      },
    }),
  ],
});

