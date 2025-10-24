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
    },
  ],
});
