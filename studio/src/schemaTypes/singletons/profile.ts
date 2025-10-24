import { defineType } from "sanity";

export const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "email",
      title: "Email",
      type: "string",
    },
    {
      name: "phone",
      title: "Phone",
      type: "string",
    },
    {
      name: "motto",
      title: "Motto",
      type: "internationalizedArrayString",
    },
    {
      name: "about",
      title: "About",
      type: "internationalizedArrayString",
    },
    {
      name: "location",
      title: "Location",
      type: "internationalizedArrayString",
    },
    {
      name: "picture",
      title: "Picture",
      type: "image",
      options: {
        hotspot: true,
      },
    },

    {
      name: "workPreference",
      title: "Work Preference",
      type: "internationalizedArrayString",
    },
    {
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [{ type: "socialLink" }],
    },
  ],
});
