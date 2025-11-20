import { EnvelopeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const contact = defineType({
  name: "contact",
  title: "Contact",
  icon: EnvelopeIcon,
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      validation: (rule) => rule.required().min(10).max(5000),
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      email: "email",
      createdAt: "createdAt",
    },
    prepare({ email, createdAt }) {
      const subtitle = createdAt
        ? `on ${new Date(createdAt).toLocaleDateString()}`
        : "";

      return {
        title: email || "No email",
        subtitle,
      };
    },
  },
});


