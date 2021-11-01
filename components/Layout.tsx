import React from 'react'
import Head from 'next/head'

const Layout: React.FC<{ pageName?: string }> = ({ children, pageName }) => {
  return (
    <>
      <Head>
        <title>Eduard Stefan | {pageName && 'Home'}</title>
      </Head>
      <div className='min-h-screen bg-gray-100'>{children}</div>
    </>
  )
}

export default Layout
