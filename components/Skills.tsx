import React from 'react'
import Image from 'next/image'
import SkillBlock from './SkillBlock'

const Skills = () => {
  return (
    <div className='self-stretch p-6 mt-8 border border-gray-300 rounded-md bg-gray-50'>
      <div className='flex flex-col flex-wrap items-center justify-around md:items-start md:flex-row'>
        <SkillBlock title='Languages'>
          <div className='grid justify-center grid-flow-col grid-rows-2 gap-8'>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image width={48} height={48} src='/svgs/html.svg' alt='' />
              <p className='text-lg text-center'>HTML</p>
            </div>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image width={48} height={48} src='/svgs/css.svg' alt='' />
              <p className='text-lg text-center'>CSS</p>
            </div>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image width={48} height={48} src='/svgs/js.svg' alt='' />
              <p className='text-lg text-center'>JavaScript</p>
            </div>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image width={48} height={48} src='/svgs/typescript.svg' alt='' />
              <p className='text-lg text-center'>TypeScript</p>
            </div>
          </div>
        </SkillBlock>

        <SkillBlock title='Frameworks / Libraries'>
          <div className='grid justify-center grid-flow-col grid-rows-2 gap-8'>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image width={48} height={48} src='/svgs/react.svg' alt='' />
              <p className='text-lg text-center'>React</p>
            </div>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image
                width={48}
                height={48}
                className='w-16 h-16 my-2'
                src='/svgs/next-js-seeklogo.com.svg'
                alt=''
              />
              <p className='text-lg text-center'>NextJS</p>
            </div>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image
                width={48}
                height={48}
                className='w-12 h-12 my-4'
                src='/svgs/svelte.svg'
                alt=''
              />
              <p className='text-lg text-center'>Svelte</p>
            </div>
            <div className='flex items-center justify-center p-2 text-lg'>
              ExpressJS
            </div>
          </div>
        </SkillBlock>

        <SkillBlock title='Databases'>
          <div className='flex flex-wrap justify-center w-full'>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image width={128} height={48} src='/svgs/mysql.svg' alt='' />
              <p className='text-lg text-center'>MySQL</p>
            </div>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image width={48} height={48} src='/svgs/postgre.svg' alt='' />
              <p className='text-lg text-center'>PostgreSQL</p>
            </div>
            <div className='flex flex-col items-center justify-center p-2'>
              <Image width={128} height={48} src='/svgs/mongodb.svg' alt='' />
              <p className='text-lg text-center'>MongoDB</p>
            </div>
          </div>
        </SkillBlock>
        {/* Other skills */}
        <SkillBlock title='Other skills / Concepts'>
          <div className='flex flex-wrap justify-around w-full'>
            <p className='p-2 m-2 text-lg text-center'>RESTful APIs</p>
            <p className='p-2 m-2 text-lg text-center'>GraphQL / Apollo</p>
            <p className='p-2 m-2 text-lg text-center'>Git / GitHub</p>
            <p className='p-2 m-2 text-lg text-center'>Adobe XD / Figma</p>
          </div>
        </SkillBlock>
      </div>
    </div>
  )
}

export default Skills
