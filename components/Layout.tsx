import React from 'react'
import Head from 'next/head'

const Layout: React.FC<{ title?: string; description?: string; image?: string }> = ({
  children,
  title,
  description,
  image
}) => {
  const fTitle = title || 'Home'
  const fImage = image || '/meta_image.png'
  const fDescription = description || 'Web Developer who builts creative and innovative websites.'
  return (
    <>
      <Head>
        <title>Eduard Stefan | {fTitle || 'Home'}</title>
        <meta name='og:title' content={fTitle} />
        <meta name='og:image' content={fImage} />
        <meta name='og:description' content={fDescription} />
        <meta name='twitter:title' content={fTitle} />
        <meta name='twitter:image' content={fImage} />
        <meta name='twitter:description' content={fDescription} />
      </Head>
      <div className='min-h-screen bg-gray-100'>{children}</div>
    </>
  )
}

export default Layout
