import { defineField, defineType } from "sanity";

export const header = defineType({
  name: "header",
  title: "Header",
  type: "object",
  fields: [
    defineField({
      name: "skipLinkText",
      title: "Skip Link Text",
      description: "Text for the skip to main content link",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "navLabel",
      title: "Navigation Label",
      description: "ARIA label for the primary navigation",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "homeButtonLabel",
      title: "Home Button Label",
      description: "ARIA label for the home button",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "button",
      validation: (rule) => rule.required(),
    }),
  ],
});
