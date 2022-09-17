import React from 'react'
import Head from 'next/head'
import { getMedia } from 'utils/getMedia'

const Layout: React.FC<{
  title?: string
  description?: string
  image?: string
}> = ({ children, title, description, image }) => {
  const fTitle = title || 'Home'
  const fImage = image
    ? getMedia(image)
    : `${process.env.NEXT_PUBLIC_URL}/meta-image.png`
  const fDescription =
    description || 'Web Developer who builts creative and innovative websites.'
  return (
    <>
      <Head>
        <title>Eduard Stefan | {fTitle || 'Home'}</title>
        <meta name='description' content={fDescription} />

        <meta property='og:title' content={fTitle} />
        <meta property='og:image' content={fImage} />
        <meta property='og:description' content={fDescription} />

        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={fTitle} />
        <meta name='twitter:image' content={fImage} />
        <meta name='twitter:description' content={fDescription} />
      </Head>
      <div className='min-h-screen bg-gray-100'>{children}</div>
    </>
  )
}

export default Layout
