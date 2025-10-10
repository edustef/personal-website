import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const resume = defineType({
  name: 'resume',
  title: 'Resume',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      description: 'The title for the resume page',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'A brief description for SEO',
      type: 'text',
    }),
    defineField({
      name: 'showSkills',
      title: 'Show Skills Section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showProjects',
      title: 'Show Projects Section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showCertificates',
      title: 'Show Certificates Section',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Resume',
      }
    },
  },
})
