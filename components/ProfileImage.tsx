import React from 'react'
import Image from 'next/image'
import { getStrapiMedia } from 'utils/getMedia'

const ProfileImage: React.FC<{ url: string; motto: string }> = ({ url, motto }) => {
  const fullUrl = getStrapiMedia(url)
  return (
    <div className='flex flex-col items-center justify-center pt-8'>
      <div className='w-24 h-24 mb-4 md:w-48 md:h-48'>
        <Image
          width={264}
          height={264}
          className='object-cover w-24 h-24 rounded-full md:w-48 md:h-48'
          src={fullUrl}
          alt=''
        />
      </div>
      <p className='text-sm italic text-center text-gray-600'>{motto}</p>
    </div>
  )
}

export default ProfileImage
