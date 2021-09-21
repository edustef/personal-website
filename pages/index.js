import Image from 'next/image';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className='container px-4 mx-auto'>
        {/* My Profile Image */}
        <div className='flex flex-col items-center justify-center mt-8'>
          <div className='w-24 h-24 mb-4 md:w-48 md:h-48'>
            <Image
              width={264}
              height={264}
              className='object-cover w-24 h-24 rounded-full md:w-48 md:h-48'
              src='/images/profile-pic.jpg'
              alt=''
            />
          </div>
          <p className='text-sm italic text-center text-gray-600'>
            A fresh Web Developer who builds creative and innovative websites.
          </p>
        </div>
        <div className='relative pb-8 mt-8'>
          {/* Middle Border */}
          <div className='absolute z-0 h-full border border-gray-700 border-opacity-20 left-1/2'></div>

          <div className='relative z-20'>
            {/* Some description about me */}
            <p className='p-6 leading-relaxed tracking-wide text-center bg-gray-100 border border-gray-700 rounded-md border-opacity-20 md:mx-32 lg:mx-64'>
              Since I was a kid technology has always amazed me, so I truly wanted to figure out how it works. Little
              did I know I would dig so deep that I would find myself in ‘Eldorado’, only that it was built of 1’s and
              0’s.
            </p>

            {/* My certificates in a timeline */}
            <div className='flex flex-col items-center mt-16'>
              <div className='p-4 bg-gray-100 border border-gray-700 rounded-md border-opacity-20'>
                <h1 className='text-3xl font-semibold'>Certificates</h1>
              </div>
              {/* left timeline */}
              <div className='flex flex-col items-center justify-center w-full mt-8 md:flex-row-reverse md:justify-between left-timeline'>
                <div className='order-1 hidden w-5/12 md:block'></div>
                <div className='flex items-center order-1 w-8 h-8 bg-gray-800 rounded-full shadow-lg'>
                  <h1 className='mx-auto text-lg font-semibold text-white'>1</h1>
                </div>
                <div className='self-stretch order-1 px-6 py-4 mt-4 bg-red-600 rounded-lg shadow-lg md:mt-0 md:w-5/12'>
                  <h2 className='text-xl font-bold text-white'>
                    <a
                      target='_blank'
                      rel='noreferrer'
                      className='underline hover:text-gray-300'
                      href='https://www.freecodecamp.org/certification/edustef/responsive-web-design'
                    >
                      Responsive Web Design
                    </a>
                  </h2>
                  <small className='text-sm italic text-white'>Issued - December 28, 2019</small>
                  <p className='mt-3 text-sm font-medium leading-snug tracking-wide text-white text-opacity-100'>
                    The FreeCodeCamp Responsive Web Design Developer Certification issued on{' '}
                    <span className='italic'>December 28, 2019</span>, representing approximately 300 hours of
                    coursework.
                  </p>
                </div>
              </div>

              {/* right timeline */}
              <div className='flex flex-col items-center justify-between w-full mt-8 md:flex-row right-timeline'>
                <div className='order-1 hidden w-5/12 md:block'></div>
                <div className='flex items-center order-1 w-8 h-8 bg-gray-800 rounded-full shadow-lg md:mb-0'>
                  <h1 className='mx-auto text-lg font-semibold text-white'>2</h1>
                </div>
                <div className='self-stretch order-1 px-6 py-4 mt-4 bg-blue-600 rounded-lg shadow-lg md:mt-0 md:w-5/12'>
                  <h2 className='text-xl font-bold text-white hover:text-gray-300'>
                    <a
                      target='_blank'
                      rel='noreferrer'
                      className='underline '
                      href='https://www.freecodecamp.org/certification/edustef/responsive-web-design'
                    >
                      APIs and Microservices
                    </a>
                  </h2>
                  <small className='text-sm italic text-white'>Issued - December 28, 2019</small>
                  <p className='mt-3 text-sm font-medium leading-snug tracking-wide text-white text-opacity-100'>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of
                    type and scrambled it to make a type specimen book.
                  </p>
                </div>
              </div>

              {/* left timeline */}
              <div className='flex flex-col items-center justify-center w-full mt-8 md:flex-row-reverse md:justify-between left-timeline'>
                <div className='order-1 hidden w-5/12 md:block'></div>
                <div className='flex items-center order-1 w-8 h-8 bg-gray-800 rounded-full shadow-lg'>
                  <h1 className='mx-auto text-lg font-semibold text-white'>3</h1>
                </div>
                <div className='self-stretch order-1 px-6 py-4 mt-4 bg-green-700 rounded-lg shadow-lg md:mt-0 md:w-5/12'>
                  <h2 className='text-xl font-bold text-white'>
                    <a
                      target='_blank'
                      rel='noreferrer'
                      className='underline hover:text-gray-300'
                      href='https://www.freecodecamp.org/certification/edustef/responsive-web-design'
                    >
                      JavaScript Algorithms and Data Structures
                    </a>
                  </h2>
                  <small className='text-sm italic text-white'>Issued - December 28, 2019</small>
                  <p className='mt-3 text-sm font-medium leading-snug tracking-wide text-white text-opacity-100'>
                    The FreeCodeCamp Responsive Web Design Developer Certification issued on{' '}
                    <span className='italic'>December 28, 2019</span>, representing approximately 300 hours of
                    coursework.
                  </p>
                </div>
              </div>

              {/* right timeline */}
              <div className='flex flex-col items-center justify-between w-full mt-8 md:flex-row right-timeline'>
                <div className='order-1 hidden w-5/12 md:block'></div>
                <div className='flex items-center order-1 w-8 h-8 bg-gray-800 rounded-full shadow-lg md:mb-0'>
                  <h1 className='mx-auto text-lg font-semibold text-white'>4</h1>
                </div>
                <div className='self-stretch order-1 px-6 py-4 mt-4 bg-pink-600 rounded-lg shadow-lg md:mt-0 md:w-5/12'>
                  <h2 className='text-xl font-bold'>
                    <a
                      target='_blank'
                      rel='noreferrer'
                      className='text-white underline hover:text-gray-300'
                      href='https://www.freecodecamp.org/certification/edustef/responsive-web-design'
                    >
                      Front End Libraries
                    </a>
                  </h2>
                  <small className='text-sm italic text-white'>Issued - December 28, 2019</small>
                  <p className='mt-3 text-sm font-medium leading-snug tracking-wide text-white text-opacity-100'>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of
                    type and scrambled it to make a type specimen book.
                  </p>
                </div>
              </div>
            </div>

            {/* My skills */}
            <div className='relative flex flex-col items-center mt-8'>
              <div className='p-4 bg-gray-100 border border-gray-700 rounded-md border-opacity-20'>
                <h1 className='text-3xl font-semibold'>Skills</h1>
              </div>
              <div className='self-stretch p-6 mt-8 bg-gray-100 border border-gray-700 rounded-md border-opacity-20'>
                <div className='flex flex-col flex-wrap items-center justify-around md:items-start md:flex-row'>
                  {/* Languages */}
                  <div className='w-full mb-4 md:w-64'>
                    <h2 className='mb-4 text-2xl font-semibold text-center'>Languages</h2>
                    <div className='grid grid-flow-col grid-rows-2'>
                      <div className='flex flex-col items-center justify-center p-2'>
                        <Image width={48} height={48} src='/svgs/html.svg' alt='' />
                        <p className='text-lg text-center'>HTML</p>
                      </div>
                      <div className='flex flex-col items-center justify-center p-2'>
                        <Image width={48} height={48} src='/svgs/css.svg' alt='' />
                        <p className='text-lg text-center'>CSS</p>
                      </div>
                      <div className='flex flex-col items-center justify-center p-2'>
                        <Image width={48} height={48} src='/svgs/js.svg' alt='' />
                        <p className='text-lg text-center'>JavaScript</p>
                      </div>
                      <div className='flex flex-col items-center justify-center p-2'>
                        <Image width={48} height={48} src='/svgs/typescript.svg' alt='' />
                        <p className='text-lg text-center'>TypeScript</p>
                      </div>
                    </div>
                  </div>
                  {/* Frameworks */}
                  <div className='w-full mb-4 md:w-64'>
                    <h2 className='mb-2 text-2xl font-semibold text-center'>Frameworks</h2>
                    <div className='grid grid-flow-col grid-rows-2'>
                      <div className='flex flex-col items-center justify-center p-2'>
                        <Image width={48} height={48} src='/svgs/react.svg' alt='' />
                        <p className='text-lg text-center'>React</p>
                      </div>
                      <div className='flex flex-col items-center justify-center p-2'>
                        <Image
                          width={48}
                          height={48}
                          className='w-16 h-16 my-2'
                          src='/svgs/next-js-seeklogo.com.svg'
                          alt=''
                        />
                        <p className='text-lg text-center'>NextJS</p>
                      </div>
                      <div className='flex flex-col items-center justify-center p-2'>
                        <Image width={48} height={48} className='w-12 h-12 my-4' src='/svgs/svelte.svg' alt='' />
                        <p className='text-lg text-center'>Svelte</p>
                      </div>
                      <div className="flex items-center justify-center p-2 text-lg">ExpressJS</div>
                    </div>
                  </div>
                  {/* Databases */}
                  <div className='w-full mb-4 md:w-64'>
                    <h2 className='mb-2 text-2xl font-semibold text-center'>Databases</h2>
                    <div className='flex flex-wrap justify-around w-full'>
                      <div className='flex flex-col items-center justify-center p-2'>
                        <Image width={128} height={48} src='/svgs/mysql.svg' alt='' />
                        <p className='text-lg text-center'>MySQL</p>
                      </div>
                      <div className='flex flex-col items-center justify-center p-2'>
                        <Image width={96} height={48} src='/svgs/postgre.svg' alt='' />
                        <p className='text-lg text-center'>PostgreSQL</p>
                      </div>
                      <div className='flex flex-col items-center justify-center p-2'>
                        <Image width={96} height={48} src='/svgs/mongodb.svg' alt='' />
                        <p className='text-lg text-center'>MongoDB</p>
                      </div>
                    </div>
                  </div>
                  {/* Other skills */}
                  <div className='w-full mb-4 md:w-64'>
                    <h2 className='mb-2 text-2xl font-semibold text-center'>Other skills</h2>
                    <div className='flex flex-wrap justify-around w-full'>
                      <p className='p-2 m-2 text-lg text-center'>RESTful APIs</p>
                      <p className='p-2 m-2 text-lg text-center'>GraphQL / Apollo</p>
                      <p className='p-2 m-2 text-lg text-center'>Git / GitHub</p>
                      <p className='p-2 m-2 text-lg text-center'>Adobe XD / Figma</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects */}
            <div className='flex flex-col items-center mt-8'>
              <div className='flex flex-col items-center bg-gray-100'>
                <div className='p-4 border border-gray-700 rounded-md border-opacity-20'>
                  <h1 className='text-3xl font-semibold'>Projects</h1>
                </div>
              </div>
              <div className='self-stretch p-6 mt-8 bg-gray-100 border border-gray-700 rounded-md border-opacity-20 md:mx-32 lg:mx-64'>
                <div className='flex-col space-y-8 leading-relaxed tracking-wide'>
                  {/* Miss Dulces*/}
                  <div className='p-6 border-b border-gray-300'>
                    <div className='inline-flex items-center justify-center w-10 h-10 mb-4 text-indigo-500 bg-indigo-100 rounded-full'>
                      <Image width={36} height={36} className='w-6 h-6 fill-curent' src='/svgs/gatsby.svg' alt='' />
                    </div>
                    <h2 className='text-lg font-medium title-font'>
                      <a
                        href='https:\\www.pasteleriamissdulces.es'
                        target='_blank'
                        rel='noreferrer'
                        className='underline'
                      >
                        Pasteleria Miss Dulces
                      </a>
                    </h2>
                    <p className='mt-4 text-base leading-relaxed'>
                      First real project for a client using Gatsby, GraphQL with the goal of using best SEO and best
                      practices for security and performance. Implements google maps API, facebook API to fetch posts,
                      google analytics and a cookie banner to be GDPR compliant.
                    </p>
                    <p className='mt-4 text-base leading-relaxed'>Features:</p>
                    <ul className='list-disc list-inside'>
                      <li>SEO best practices</li>
                      <li>Security and perfromance best practices</li>
                      <li>Google Maps API</li>
                      <li>Facebook API</li>
                      <li>Google Analytics</li>
                      <li>Cookie Banner GDPR Complaint</li>
                    </ul>
                    <div className='flex items-baseline justify-between w-full mt-4 leading-none text-center'>
                      <span className='inline-flex items-center py-1 mr-3 text-sm leading-none'>
                        <svg
                          className='w-4 h-4 mr-2 text-blue-500 fill-current '
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 512 512'
                        >
                          <path d='M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z' />
                        </svg>
                        2 months
                      </span>
                      <a
                        className='inline-flex items-center py-1 mr-3 text-sm leading-none underline hover:text-gray-700'
                        href='https://tailwindcss.com/'
                        target='_blank'
                        rel='noreferrer'
                      >
                        <svg
                          className='inline w-4 h-4 mr-2'
                          aria-hidden='true'
                          data-prefix='fab'
                          data-icon='github'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 496 512'
                        >
                          <path
                            fill='currentColor'
                            d='M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z'
                          />
                        </svg>
                        <span>See code on GitHub</span>
                      </a>
                    </div>
                  </div>
                  {/* Markdown Editor*/}
                  <div className='p-6 border-b border-gray-300'>
                    <div className='inline-flex items-center justify-center w-10 h-10 mb-4 text-indigo-500 bg-indigo-100 rounded-full'>
                      <i className='text-3xl text-blue-500 fab fa-react'></i>
                    </div>
                    <h2 className='text-lg font-medium title-font'>
                      <a
                        href='https://edustef.github.io/markdown-fcc/'
                        target='_blank'
                        rel='noreferrer'
                        className='underline'
                      >
                        Realtime Markdown Editor
                      </a>
                    </h2>
                    <p className='mt-4 text-base leading-relaxed'>Simple markdown editor done in React.</p>
                    <p className='mt-4 text-base leading-relaxed'>Features:</p>
                    <ul className='list-disc list-inside'>
                      <li>Local Storage</li>
                      <li>Real time parallel scroll of two divs</li>
                      <li>Download the markdown or the generated HTML</li>
                    </ul>
                    <div className='flex justify-between w-full mt-4 leading-none text-center'>
                      <span className='inline-flex items-center py-1 mr-3 text-sm leading-none '>
                        <svg
                          className='w-4 h-4 mr-2 text-blue-500 fill-current'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 512 512'
                        >
                          <path d='M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z' />
                        </svg>
                        1 month
                      </span>
                      <a
                        className='inline-flex items-center py-1 mr-3 text-sm leading-none underline hover:text-gray-700'
                        href='https://tailwindcss.com/'
                        target='_blank'
                        rel='noreferrer'
                      >
                        <svg
                          className='inline w-4 h-4 mr-2'
                          aria-hidden='true'
                          data-prefix='fab'
                          data-icon='github'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 496 512'
                        >
                          <path
                            fill='currentColor'
                            d='M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z'
                          />
                        </svg>
                        <span>See code on GitHub</span>
                      </a>
                    </div>
                  </div>
                  {/* DWS Practicas */}
                  <div className='p-6'>
                    <div className='inline-flex items-center justify-center w-10 h-10 mb-4 text-indigo-500 bg-indigo-100 rounded-full'>
                      <Image width={36} height={36} className='w-6 h-6 fill-curent' src='/svgs/gatsby.svg' alt='' />
                    </div>
                    <h2 className='text-lg font-medium title-font'>
                      <a
                        href='https://dws-practicas.herokuapp.com/index.php'
                        target='_blank'
                        rel='noreferrer'
                        className='underline'
                      >
                        A website for my school practices
                      </a>
                    </h2>
                    <p className='mt-4 text-base leading-relaxed'>
                      A website made in pure PHP that I created to organize my practices in school and also be able to
                      easly share them with my professor.
                    </p>
                    <p className='mt-4 text-base leading-relaxed'>Features:</p>
                    <ul className='list-disc list-inside'>
                      <li>Browser Local Storage/Session</li>
                      <li>Lots of exercises using many different algorithms</li>
                      <li>
                        Simple sidebar that&apos;s using summary/details. Implemented by reading the folder structure
                        with recursion.
                      </li>
                    </ul>
                    <div className='flex justify-between w-full mt-4 leading-none text-center'>
                      <span className='inline-flex items-center py-1 mr-3 text-sm leading-none '>
                        <svg
                          className='w-4 h-4 mr-2 text-blue-500 fill-current '
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 512 512'
                        >
                          <path d='M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z' />
                        </svg>
                        1 month
                      </span>
                      <a
                        className='inline-flex items-center py-1 mr-3 text-sm leading-none underline hover:text-gray-700'
                        href='https://tailwindcss.com/'
                        target='_blank'
                        rel='noreferrer'
                      >
                        <svg
                          className='inline w-4 h-4 mr-2'
                          aria-hidden='true'
                          data-prefix='fab'
                          data-icon='github'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 496 512'
                        >
                          <path
                            fill='currentColor'
                            d='M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z'
                          />
                        </svg>
                        <span>See code on GitHub</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='flex flex-col justify-around p-8 space-y-4 border-t border-gray-700 md:flex-row md:space-y-0 border-opacity-20'>
        <p className='font-semibold'>&copy;Website created by Eduard Stefan</p>
        <a className='hover:text-gray-700' href='https://tailwindcss.com/' target='_blank' rel='noreferrer'>
          <svg
            className='inline w-4 h-4'
            aria-hidden='true'
            data-prefix='fab'
            data-icon='github'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 496 512'
          >
            <path
              fill='currentColor'
              d='M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z'
            />
          </svg>
          <span className='font-semibold'>See my Github Page</span>
        </a>
        <a className='hover:text-gray-700' href='https://linkedin.com/' target='_blank' rel='noreferrer'>
          <svg
            className='inline w-4 h-4 text-indigo-500'
            aria-hidden='true'
            data-prefix='fab'
            data-icon='linkedin'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 448 512'
          >
            <path
              fill='currentColor'
              d='M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z'
            />
          </svg>
          <span className='font-semibold'>Follow me on LinkedIn</span>
        </a>
        <a className='hover:text-gray-700' href='https://github.com/edustef' target='_blank' rel='noreferrer'>
          <svg className='inline w-4 h-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 54 33'>
            <g clipPath='url(#prefix__clip0)'>
              <path
                fill='#06B6D4'
                fillRule='evenodd'
                d='M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z'
                clipRule='evenodd'
              />
            </g>
            <defs>
              <clipPath id='prefix__clip0'>
                <path fill='#fff' d='M0 0h54v32.4H0z' />
              </clipPath>
            </defs>
          </svg>
          <span className='font-semibold'>Build with TailwindCSS</span>
        </a>
      </footer>
    </Layout>
  );
}
