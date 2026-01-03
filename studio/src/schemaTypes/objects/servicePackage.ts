import { PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const servicePackage = defineType({
  name: "servicePackage",
  title: "Service Package",
  type: "object",
  icon: PackageIcon,
  fields: [
    defineField({
      name: "name",
      title: "Package Name",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price Range",
      description: "e.g., '$1,500 – $3,000'",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "internationalizedArrayBlockContent",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bestFor",
      title: "Best For",
      description: "e.g., Startups, personal brands...",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      type: "array",
      of: [{ type: "internationalizedArrayString" }],
    }),
    defineField({
      name: "timeline",
      title: "Timeline",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "isPopular",
      title: "Is Popular?",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name.0.value",
      subtitle: "price",
    },
  },
});
