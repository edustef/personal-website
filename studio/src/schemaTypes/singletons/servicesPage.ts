import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Services Page",
  type: "document",
  icon: TagIcon,

  fields: [
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "internationalizedArraySlug",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "selectionTitle",
      title: "Selection Screen Title",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "selectionDescription",
      title: "Selection Screen Description",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "technicalOptionLabel",
      title: "Technical Option Label",
      description: "Text for the 'I know tech' card",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "technicalOptionDescription",
      title: "Technical Option Description",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "solutionOptionLabel",
      title: "Solution Option Label",
      description: "Text for the 'I want a solution' card",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "solutionOptionDescription",
      title: "Solution Option Description",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "technicalView",
      title: "Technical View Content",
      type: "serviceView",
    }),
    defineField({
      name: "solutionView",
      title: "Solution View Content",
      type: "serviceView",
    }),
  ],
  preview: {
    select: {
      title: "title.0.value",
    },
    prepare({ title }) {
      return {
        title: title || "Services Page",
        subtitle: "Singleton",
      };
    },
  },
});
