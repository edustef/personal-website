import React from 'react'
import ReactMarkdown from 'react-markdown'

interface Props {
  title: string
  link: string
  description: string
  dateIssued: string
  num: number
  isRight: boolean
  twColor: string
}

const CertificateBlock: React.FC<Props> = ({
  title,
  link,
  description,
  dateIssued,
  num,
  isRight = false,
  twColor
}) => {
  const formatedDate = new Date(dateIssued).toLocaleDateString('en-GB', {
    dateStyle: 'long'
  })
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
      <div
        className={`self-stretch order-1 px-6 py-4 mt-4 ${twColor} rounded-lg shadow-lg md:mt-0 md:w-5/12`}
      >
        <h2 className='text-xl font-bold text-white'>
          <a
            target='_blank'
            rel='noreferrer'
            className='underline hover:text-gray-300'
            href={link}
          >
            {title}
          </a>
        </h2>
        <small className='text-sm italic text-gray-300'>
          Issued on {formatedDate}
        </small>
        <div className='mt-3 text-sm leading-snug tracking-wide text-white text-opacity-100'>
          <ReactMarkdown className='remark'>{description}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

export default CertificateBlock
