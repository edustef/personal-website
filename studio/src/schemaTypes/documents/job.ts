import {defineType} from 'sanity'

export const job = defineType({
  name: 'job',
  title: 'Job',
  type: 'document',
  fieldsets: [
    {
      name: 'duration',
      title: 'Duration',
      options: {
        columns: 2
      }
    },
    
  ],
  fields: [
    {
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    },
    {
      name: 'position',
      title: 'Position',
      type: 'string',
    },
    {
      name: 'isCurrent',
      title: 'Is Current',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      fieldset: 'duration',
      validation: (rule) => rule.required(),
    },
    {
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      fieldset: 'duration',
      readOnly: ({parent}) => parent?.isCurrent,
    },
    {
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayBlockContent',
      validation: (rule) => rule.required(),
    },
    {
      name: 'todayText',
      title: 'Today Text',
      type: 'string',
      hidden: ({parent}) => !parent?.isCurrent,
    },
    {
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'skill'}],
        },
      ],
    },
  ],
})
