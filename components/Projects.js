import React from 'react';
import Image from 'next/image';
import ProjectBlock from './ProjectBlock';

export default function Projects() {
  return (
    <div className='self-stretch p-6 mt-8 border border-gray-300 rounded-md bg-gray-50'>
      {/* Miss Dulces*/}
      <ProjectBlock
        title='Pasteleria Miss Dulces'
        description='First real project for a client using Gatsby, GraphQL with the goal of using best SEO and best practices for
          security and performance. Implements google maps API, facebook API to fetch posts, google analytics and a
          cookie banner to be GDPR compliant.'
        siteUrl='https:\\www.pasteleriamissdulces.es'
        duration='2 months'
        sourceUrl='https:\\github.com\edustef\pasteleria-miss-dulces'
        stackLogoUrl='/svgs/gatsby.svg'
        features={[
          'SEO best practices',
          'Security and perfromance best practices',
          'Google Maps API',
          'Facebook API',
          'Google Analytics',
          'Cookie Banner GDPR Complaint',
        ]}
      />
      <ProjectBlock
        title='Realtime Markdown Editor'
        description='Simple markdown editor done in React.'
        siteUrl='https://edustef.github.io/markdown-fcc/'
        sourceUrl='https://github.com/edustef/markdown-fcc'
        stackLogoUrl='/svgs/react.svg'
        duration='1 month'
        features={[
          'Local Storage',
          'Real time parallel scroll of two divs',
          'Download the markdown or the generated HTML',
        ]}
      />
      {/* DWS Practicas */}
      <ProjectBlock
        title='A website for my school practices'
        description='A website made in pure PHP that I created to organize my practices in school and also be able to easly share
        them with my professor.'
        siteUrl='https://dws-practicas.herokuapp.com/index.php'
        sourceUrl='https://github.com/edustef/dws-practicas'
        stackLogoUrl='/svgs/js.svg'
        duration='1 month'
        features={[
          'Browser Local Storage / Session',
          'Lots of exercises using many different algorithms',
          'Simple sidebar that&apos;s using summary/details. Implemented by reading the folder structure with recursion',
        ]}
      />
    </div>
  );
}
