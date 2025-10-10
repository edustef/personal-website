import { defineArrayMember, defineField, defineType } from 'sanity'

export const timeline = defineType({
  name: 'timeline',
  title: 'Timeline',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      description:
        "Allows for creating a number of timelines (max 2) for displaying in the page's body",
      type: 'array',
      validation: (Rule) => Rule.max(2),
      of: [
        defineArrayMember({
          name: 'item',
          title: 'Item',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'milestones',
              title: 'Milestones',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'milestone',
                  title: 'Milestone',
                  type: 'milestone',
                }),
              ],
            }),
          ],
          preview: {
            select: {
              items: 'milestones',
              title: 'title',
            },
            prepare({ items, title }) {
              const hasItems = Array.isArray(items) && items.length > 0
              const milestoneNames =
                hasItems && items.map((timeline: { title: string }) => timeline.title).join(', ')

              return {
                subtitle: hasItems
                  ? `${milestoneNames} (${items.length} item${
                      items.length > 1 ? 's' : ''
                    })`
                  : 'No milestones',
                title,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({ items }) {
      const hasItems = Array.isArray(items) && items.length > 0
      const timelineNames =
        hasItems && items.map((timeline: { title: string }) => timeline.title).join(', ')

      return {
        title: 'Timelines',
        subtitle: hasItems
          ? `${timelineNames} (${items.length} item${
              items.length > 1 ? 's' : ''
            })`
          : 'No timelines',
      }
    },
  },
})
