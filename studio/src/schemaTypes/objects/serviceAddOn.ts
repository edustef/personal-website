import { defineField, defineType } from "sanity";
import { PlugIcon } from "@sanity/icons";

export const serviceAddOn = defineType({
  name: "serviceAddOn",
  title: "Service Add-On",
  type: "object",
  icon: PlugIcon,
  fields: [
    defineField({
      name: "name",
      title: "Add-On Name",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "name.0.value",
      subtitle: "price",
    },
  },
});

