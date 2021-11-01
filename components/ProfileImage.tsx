import React from 'react'
import Image from 'next/image'
import { getMedia } from 'utils/getMedia'
import Asset from 'interfaces/asset'

const ProfileImage: React.FC<{ picture: Asset; motto: string }> = ({ picture, motto }) => {
  const fullUrl = getMedia(picture.url)
  return (
    <div className='flex flex-col items-center justify-center pt-8'>
      <div className='w-32 h-32 mb-4 md:w-48 md:h-48'>
        <Image
          priority
          width={picture.width}
          height={picture.height}
          className='object-cover w-24 h-24 rounded-full md:w-48 md:h-48'
          src={fullUrl}
          alt=''
        />
      </div>
      <p className='w-64 text-sm italic text-center text-gray-600 md:w-full'>{motto}</p>
    </div>
  )
}

export default ProfileImage
