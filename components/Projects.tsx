import React from 'react'
import Image from 'next/image'
import ProjectBlock from './ProjectBlock'
import Project from 'interfaces/project'

const Projects: React.FC<{ projects: Project[] }> = ({ projects }) => {
  return (
    <div className='self-stretch p-6 mt-8 border border-gray-300 rounded-md bg-gray-50'>
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
