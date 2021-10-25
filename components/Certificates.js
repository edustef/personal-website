import React, { Children } from 'react'
import CertificateBlock from './CertificateBlock'

export default function Certificates({ children }) {
  const childrenArray = Children.count(children)
  return (
    <div>
      <CertificateBlock
        title='Responsive Web Design'
        link='https://www.freecodecamp.org/certification/edustef/responsive-web-design'
        dateIssued='28 December, 2019'
        num='1'
        twColor='bg-red-800'
      >
        The FreeCodeCamp Responsive Web Design Developer Certification issued on{' '}
        <span className='italic'>December 28, 2019</span>, representing approximately 300 hours of coursework.
      </CertificateBlock>
      <CertificateBlock
        title='JavaScript Algorithms and Data Structures'
        link='https://www.freecodecamp.org/certification/edustef/javascript-algorithms-and-data-structures'
        dateIssued='10 August 2021'
        num='2'
        isRight
        twColor='bg-blue-800'
      ></CertificateBlock>

      <CertificateBlock
        title='NodeJS - The Complete Guide'
        link='https://www.udemy.com/certificate/UC-de2cd267-45b9-4bb9-a21e-30d989552a55/'
        dateIssued='21 July 2021'
        num='3'
        twColor='bg-green-800'
      ></CertificateBlock>
      <CertificateBlock num='4' isRight twColor='bg-pink-800'>
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
      </CertificateBlock>
    </div>
  )
}
