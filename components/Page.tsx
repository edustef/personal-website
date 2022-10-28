import Layout from 'components/Layout'
import React, { ReactNode } from 'react'
import Head from 'next/head'

type Metadata = {
  title: string
  description: string
  image: string
}

type Props = {
  children: ReactNode
  metadata: Metadata
}

const Page = ({ children, metadata }: Props) => {
  const { title, description, image } = metadata

  return (
    <>
      <Head>
        <title>Eduard Stefan | {title}</title>
        <meta name='description' content={description} />

        <meta property='og:title' content={title} />
        <meta property='og:image' content={image} />
        <meta property='og:description' content={description} />

        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:image' content={image} />
        <meta name='twitter:description' content={description} />
      </Head>
      {children}
    </>
  )
}

export default Page
