import React from 'react';

export default function CertificateBlock({ title, link, dateIssued, num, isRight, twColor, children }) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full mt-8 ${
        !isRight ? 'md:flex-row-reverse' : 'md:flex-row'
      } md:justify-between left-timeline`}
    >
      <div className='hidden w-5/12 md:block'></div>
      <div className='flex items-center order-1 w-8 h-8 bg-gray-800 rounded-full shadow-lg'>
        <h1 className='mx-auto text-lg font-semibold text-white'>{num}</h1>
      </div>
      <div className={`self-stretch order-1 px-6 py-4 mt-4 ${twColor} rounded-lg shadow-lg md:mt-0 md:w-5/12`}>
        <h2 className='text-xl font-bold text-white'>
          <a target='_blank' rel='noreferrer' className='underline hover:text-gray-300' href={link}>
            {title}
          </a>
        </h2>
        <small className='text-sm italic text-white'>Issued - {dateIssued}</small>
        <p className='mt-3 text-sm font-medium leading-snug tracking-wide text-white text-opacity-100'>{children}</p>
      </div>
    </div>
  );
}
