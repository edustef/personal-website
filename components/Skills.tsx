import React from 'react'
import Image from 'next/image'
import SkillBlock from './SkillBlock'

const Skills = () => {
  return (
    <div className='mt-8 self-stretch rounded-md border border-gray-300 bg-gray-50 p-6'>
      <div className='flex flex-col flex-wrap items-center justify-around md:flex-row md:items-start'>
        <SkillBlock title='Languages'>
          <div className='grid grid-flow-col grid-rows-2 justify-center gap-8'>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image width={48} height={48} src='/svgs/html.svg' alt='' />
              <p className='text-center text-lg'>HTML</p>
            </div>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image width={48} height={48} src='/svgs/css.svg' alt='' />
              <p className='text-center text-lg'>CSS</p>
            </div>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image width={48} height={48} src='/svgs/js.svg' alt='' />
              <p className='text-center text-lg'>JavaScript</p>
            </div>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image width={48} height={48} src='/svgs/typescript.svg' alt='' />
              <p className='text-center text-lg'>TypeScript</p>
            </div>
          </div>
        </SkillBlock>

        <SkillBlock title='Frameworks / Libraries'>
          <div className='grid grid-flow-col grid-rows-2 justify-center gap-8'>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image width={48} height={48} src='/svgs/react.svg' alt='' />
              <p className='text-center text-lg'>React</p>
            </div>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image
                width={48}
                height={48}
                className='my-2 h-16 w-16'
                src='/svgs/next-js-seeklogo.com.svg'
                alt=''
              />
              <p className='text-center text-lg'>NextJS</p>
            </div>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image
                width={48}
                height={48}
                className='my-4 h-12 w-12'
                src='/svgs/svelte.svg'
                alt=''
              />
              <p className='text-center text-lg'>Svelte</p>
            </div>
            <div className='flex items-center justify-center p-2 text-lg'>
              ExpressJS
            </div>
          </div>
        </SkillBlock>

        <SkillBlock title='Databases'>
          <div className='flex w-full flex-wrap justify-center'>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image width={128} height={48} src='/svgs/mysql.svg' alt='' />
              <p className='text-center text-lg'>MySQL</p>
            </div>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image width={48} height={48} src='/svgs/postgre.svg' alt='' />
              <p className='text-center text-lg'>PostgreSQL</p>
            </div>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image width={128} height={48} src='/svgs/mongodb.svg' alt='' />
              <p className='text-center text-lg'>MongoDB</p>
            </div>
          </div>
        </SkillBlock>
        {/* Other skills */}
        <SkillBlock title='Other skills / Concepts'>
          <div className='flex w-full flex-wrap justify-around'>
            <p className='m-2 p-2 text-center text-lg'>RESTful APIs</p>
            <p className='m-2 p-2 text-center text-lg'>GraphQL / Apollo</p>
            <p className='m-2 p-2 text-center text-lg'>Git / GitHub</p>
            <p className='m-2 p-2 text-center text-lg'>Adobe XD / Figma</p>
          </div>
        </SkillBlock>
      </div>
    </div>
  )
}

export default Skills
