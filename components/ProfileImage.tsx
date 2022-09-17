import React from 'react'
import Image from 'next/image'
import { getMedia } from 'utils/getMedia'
import Asset from 'interfaces/asset'

const ProfileImage: React.FC<{ picture: Asset; motto: string }> = ({
  picture,
  motto
}) => {
  const fullUrl = getMedia(picture.url)
  return (
    <div className='flex flex-col items-center justify-center pt-8'>
      <div className='mb-4 h-32 w-32 md:h-48 md:w-48'>
        <Image
          priority
          width={picture.width}
          height={picture.height}
          className='h-24 w-24 rounded-full object-cover md:h-48 md:w-48'
          src={fullUrl}
          alt=''
        />
      </div>
      <p className='w-64 text-center text-sm italic text-gray-600 md:w-full'>
        {motto}
      </p>
    </div>
  )
}

export default ProfileImage
