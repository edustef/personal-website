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
      className={`mt-8 flex w-full flex-col items-center justify-center ${
        !isRight ? 'md:flex-row-reverse' : 'md:flex-row'
      } left-timeline md:justify-between`}
    >
      <div className='hidden w-5/12 md:block'></div>
      <div className='order-1 flex h-8 w-8 items-center rounded-full bg-gray-800 shadow-lg'>
        <h1 className='mx-auto text-lg font-semibold text-white'>{num}</h1>
      </div>
      <div
        className={`order-1 mt-4 self-stretch px-6 py-4 ${twColor} rounded-lg shadow-lg md:mt-0 md:w-5/12`}
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
