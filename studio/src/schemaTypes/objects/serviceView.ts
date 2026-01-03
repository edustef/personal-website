import { EyeOpenIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const serviceView = defineType({
  name: "serviceView",
  title: "Service View",
  type: "object",
  icon: EyeOpenIcon,
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "packages",
      title: "Packages",
      type: "array",
      of: [{ type: "servicePackage" }],
    }),
    defineField({
      name: "addOns",
      title: "Add-Ons",
      type: "array",
      of: [{ type: "serviceAddOn" }],
    }),
    defineField({
      name: "maintenancePlans",
      title: "Maintenance Plans",
      type: "array",
      of: [{ type: "maintenancePlan" }],
    }),
    defineField({
      name: "process",
      title: "Process",
      type: "array",
      of: [{ type: "processStep" }],
    }),
  ],
});
