import { defineType } from 'sanity'

export const button = defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  fields: [
    {
      name: 'text',

      title: 'Text',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      name: 'href',
      title: 'Href',
      type: 'url',
      validation: (rule) => rule.required(),
      hidden: ({ parent }) => parent?.isExternal === false,
    },
  ],
})
