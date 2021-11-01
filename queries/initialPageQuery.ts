import gql from 'graphql-tag'
import Certificate from 'interfaces/certificate'
import Job from 'interfaces/job'
import Profile from 'interfaces/profile'
import Project from 'interfaces/project'
import Skill from 'interfaces/skill'

const initialPageQuery = gql`
  query getData {
    profile(where: { id: "ckv9gcv4w9y7x0c089b6fe7e3" }) {
      id
      name
      about
      motto
      picture {
        id
        url
        width
        height
      }
    }
    certificates {
      id
      title
      description
      dateIssued
      link
    }
    skills {
      id
      name
      projects {
        id
        slug
        name
      }
    }
    projects {
      id
      name
      description
      duration
      sourceUrl
      siteUrl
      slug
      skills {
        id
        name
        tagColor {
          name
          value {
            hex
          }
          isTextBlack
        }
      }
    }
  }
`

export interface InitialPageQueryType {
  certificates: Certificate[]
  profile: Profile
  projects: Project[]
  skills: Skill[]
  jobs: Job[]
}

export default initialPageQuery
