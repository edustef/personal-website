import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const home = defineType({
  name: "home",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
    defineField({
      name: "title",
      description: "This field is the title of your personal website.",
      title: "Title",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Hero Headline",
      description: "Large text shown in the hero section",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Hero Tagline",
      description: "Subtitle shown below the headline",
      type: "internationalizedArrayBlockContent",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "renovationLabelPrimary",
      title: "Renovation Badge Primary",
      description: "First word in the hero badge",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "renovationLabelSecondary",
      title: "Renovation Badge Secondary",
      description: "Second word in the hero badge",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "findMeOnLabel",
      title: "Find Me On",
      description: "Heading shown above the social links",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "resumeButtonLabel",
      title: "Resume Button",
      description: "Label for the resume button in the header",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "profile",
      title: "Profile",
      type: "reference",
      to: [{ type: "profile" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ctaButtons",
      title: "CTA Buttons",
      type: "array",
      of: [{ type: "button" }],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "featuredProjects",
      title: "Featured Projects",
      description: "Select projects to feature on the homepage",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    }),
    defineField({
      name: "footer",
      title: "Footer Content",
      description: "Localized rich text shown at the bottom of the home page",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Home Page",
      };
    },
  },
});
