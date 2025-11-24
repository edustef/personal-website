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
      name: "buttonLabel",
      title: "Button Label",
      description: "Text for the button in the header",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
  ],
});
