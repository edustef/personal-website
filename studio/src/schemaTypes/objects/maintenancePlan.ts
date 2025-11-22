import { defineField, defineType } from "sanity";
import { WrenchIcon } from "@sanity/icons";

export const maintenancePlan = defineType({
  name: "maintenancePlan",
  title: "Maintenance Plan",
  type: "object",
  icon: WrenchIcon,
  fields: [
    defineField({
      name: "name",
      title: "Plan Name",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Monthly Price",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "internationalizedArrayBlockContent",
    }),
    defineField({
      name: "features",
      title: "Included Features",
      type: "array",
      of: [{ type: "internationalizedArrayString" }],
    }),
    defineField({
      name: "notIncluded",
      title: "Not Included",
      description: "Features explicitly excluded (optional)",
      type: "array",
      of: [{ type: "internationalizedArrayString" }],
    }),
  ],
  preview: {
    select: {
      title: "name.0.value",
      subtitle: "price",
    },
  },
});

