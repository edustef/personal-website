import React from 'react';
import TimelineBlock from './TimelineBlock';

export default function Timeline() {
  return (
    <div>
      <TimelineBlock num='1' twColor='bg-red-800'>
        <h2 className='text-xl font-bold text-white'>
          <a
            target='_blank'
            rel='noreferrer'
            className='underline hover:text-gray-300'
            href='https://www.freecodecamp.org/certification/edustef/responsive-web-design'
          >
            Responsive Web Design
          </a>
        </h2>
        <small className='text-sm italic text-white'>Issued - December 28, 2019</small>
        <p className='mt-3 text-sm font-medium leading-snug tracking-wide text-white text-opacity-100'>
          The FreeCodeCamp Responsive Web Design Developer Certification issued on{' '}
          <span className='italic'>December 28, 2019</span>, representing approximately 300 hours of coursework.
        </p>
      </TimelineBlock>
      <TimelineBlock num='2' isRight twColor='bg-blue-800'>
        <h2 className='text-xl font-bold text-white hover:text-gray-300'>
          <a
            target='_blank'
            rel='noreferrer'
            className='underline '
            href='https://www.freecodecamp.org/certification/edustef/responsive-web-design'
          >
            APIs and Microservices
          </a>
        </h2>
        <small className='text-sm italic text-white'>Issued - December 28, 2019</small>
        <p className='mt-3 text-sm font-medium leading-snug tracking-wide text-white text-opacity-100'>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
          industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
      </TimelineBlock>

      <TimelineBlock num='3' twColor='bg-green-800'>
        <h2 className='text-xl font-bold text-white'>
          <a
            target='_blank'
            rel='noreferrer'
            className='underline hover:text-gray-300'
            href='https://www.freecodecamp.org/certification/edustef/responsive-web-design'
          >
            JavaScript Algorithms and Data Structures
          </a>
        </h2>
        <small className='text-sm italic text-white'>Issued - December 28, 2019</small>
        <p className='mt-3 text-sm font-medium leading-snug tracking-wide text-white text-opacity-100'>
          The FreeCodeCamp Responsive Web Design Developer Certification issued on{' '}
          <span className='italic'>December 28, 2019</span>, representing approximately 300 hours of coursework.
        </p>
      </TimelineBlock>
      {/* right timeline */}
      <TimelineBlock num='4' isRight twColor='bg-pink-800'>
        <h2 className='text-xl font-bold'>
          <a
            target='_blank'
            rel='noreferrer'
            className='text-white underline hover:text-gray-300'
            href='https://www.freecodecamp.org/certification/edustef/responsive-web-design'
          >
            Front End Libraries
          </a>
        </h2>
        <small className='text-sm italic text-white'>Issued - December 28, 2019</small>
        <p className='mt-3 text-sm font-medium leading-snug tracking-wide text-white text-opacity-100'>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
          industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
      </TimelineBlock>
    </div>
  );
}
