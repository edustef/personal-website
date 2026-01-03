import { NumberIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const processStep = defineType({
  name: "processStep",
  title: "Process Step",
  type: "object",
  icon: NumberIcon,
  fields: [
    defineField({
      name: "title",
      title: "Step Title",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "internationalizedArrayBlockContent",
    }),
  ],
  preview: {
    select: {
      title: "title.0.value",
    },
  },
});
