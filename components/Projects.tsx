import React from 'react'
import Image from 'next/image'
import ProjectBlock from './ProjectBlock'
import Project from 'interfaces/project'

const Projects: React.FC<{ projects: Project[] }> = ({ projects }) => {
  return (
    <div className='mt-8 self-stretch rounded-md border border-gray-300 bg-gray-50 p-6'>
      {projects.map(
        (
          {
            id,
            description,
            duration,
            image,
            name,
            siteUrl,
            sourceUrl,
            skills
          },
          index
        ) => (
          <ProjectBlock
            isLast={index === projects.length - 1}
            key={id}
            name={name}
            description={description}
            duration={duration}
            image={image}
            siteUrl={siteUrl}
            sourceUrl={sourceUrl}
            skills={skills}
          />
        )
      )}
    </div>
  )
}

export default Projects
