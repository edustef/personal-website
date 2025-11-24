import { defineType } from "sanity";

export const button = defineType({
  name: "button",
  title: "Button",
  type: "object",
  fields: [
    {
      name: "text",
      title: "Text",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    },
    {
      name: "link",
      title: "Link",
      type: "link",
      validation: (rule) => rule.required(),
    },
  ],
  preview: {
    select: {
      text: "text",
      link: "link",
    },
    prepare({ text, link }) {
      return {
        title: text[0].value,
        subtitle: link?.linkType,
      };
    },
  },
});
