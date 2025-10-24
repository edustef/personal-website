import {defineType} from 'sanity'
import {toPlainText} from '../../lib/toPlainText'

export const certificate = defineType({
  name: 'certificate',
  title: 'Certificate',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayBlockContent',
    },
    {
      name: 'dateIssued',
      title: 'Date Issued',
      type: 'date',
    },
    {
      name: 'link',
      title: 'Link',
      type: 'url',
    },
  ],

  preview: {
    select: {
      title: 'title',
      description: 'description',
      dateIssued: 'dateIssued',
    },
    prepare({title, description, dateIssued}) {
      const descriptionText = toPlainText(description)
      return {title, subtitle: `${descriptionText} on ${dateIssued}`}
    },
  },
})
