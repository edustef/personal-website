import { HelpCircleIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "question",
      description: "The FAQ question",
      title: "Question",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "internationalizedArrayBlockContent",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      description: "Display order (lower numbers appear first)",
      type: "number",
      validation: (rule) => rule.required().min(0),
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      question: "question",
    },
    prepare({ question }) {
      const questionText =
        question?.find((item: { _key: string; value: string }) => item.value)
          ?.value || "Untitled FAQ";
      return {
        title: questionText,
      };
    },
  },
});

