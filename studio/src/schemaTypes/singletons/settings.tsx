import { CogIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const settings = defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  icon: CogIcon,

  fields: [
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      description: "This field is the title of your blog.",
      title: "Title",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      description: "Used on the Homepage",
      title: "Description",
      type: "internationalizedArrayBlockContent",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "header",
      title: "Header",
      type: "header",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Settings",
      };
    },
  },
});
