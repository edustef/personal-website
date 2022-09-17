import React from 'react'
import Project from 'interfaces/project'
import ReactMarkdown from 'react-markdown'
import clsx from 'clsx'

const ProjectBlock: React.FC<Partial<Project> & { isLast: boolean }> = ({
  siteUrl,
  sourceUrl,
  duration,
  name,
  description,
  skills,
  isLast
}) => {
  return (
    <div className={`p-6 ${!isLast && 'border-b'} border-gray-300`}>
      <h2 className='text-2xl font-medium title-font'>
        <a
          href={siteUrl}
          target='_blank'
          rel='noreferrer'
          className='min-w-0 underline whitespace-nowrap'
        >
          {name}
        </a>
      </h2>

      <ReactMarkdown className='mt-4 remark'>{description}</ReactMarkdown>
      <div className='flex flex-wrap mt-2 -ml-2'>
        {skills.map(({ id, name, tagColor }) => (
          <span
            key={id}
            className={clsx(
              'inline-block px-4 py-1 my-3 mx-2 rounded-full',
              !tagColor.isTextBlack && 'text-white'
            )}
            style={{ backgroundColor: tagColor.value.hex }}
          >
            {name}
          </span>
        ))}
      </div>
      <div className='flex flex-col items-baseline justify-between w-full mt-2 leading-none text-center md:flex-row'>
        <span className='inline-flex items-center py-2 mr-3 text-sm leading-none'>
          <svg
            className='w-5 mr-2 text-blue-500 fill-current '
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 512 512'
          >
            <path d='M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z' />
          </svg>
          {duration}
        </span>
        <a
          className='inline-flex items-center py-1 mr-3 text-sm leading-none underline hover:text-gray-700'
          href={sourceUrl}
          target='_blank'
          rel='noreferrer'
        >
          <svg
            className='inline w-5 mr-2'
            aria-hidden='true'
            data-prefix='fab'
            data-icon='github'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 496 512'
          >
            <path
              fill='currentColor'
              d='M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z'
            />
          </svg>
          <span>See code on GitHub</span>
        </a>
      </div>
    </div>
  )
}

export default ProjectBlock
