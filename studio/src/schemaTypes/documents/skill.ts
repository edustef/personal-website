import { defineType } from "sanity";

export const skill = defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    },
    {
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Technical", value: "technical" },
          { title: "Soft", value: "soft" },
        ],
      },
    },
  ],
});
