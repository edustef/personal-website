import {HomeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const home = defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      description: 'This field is the title of your personal website.',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Hero Headline',
      description: 'Large text shown in the hero section',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Hero Tagline',
      description: 'Subtitle shown below the headline',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'profile',
      title: 'Profile',
      type: 'reference',
      to: [{type: 'profile'}],
    }),
    defineField({
      name: 'ctaButtons',
      title: 'CTA Buttons',
      type: 'array',
      of: [{type: 'button'}],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured Projects',
      description: 'Select projects to feature on the homepage',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        subtitle: 'Home',
        title,
      }
    },
  },
})
