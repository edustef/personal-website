import { ReactNode } from 'react'
import { getMedia } from 'utils/getMedia'
import Footer from './Footer'

type Props = {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <div className='flex min-h-screen'>
      <main className=' flex-grow bg-gray-100'>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
