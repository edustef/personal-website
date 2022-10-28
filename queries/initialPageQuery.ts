import { gql } from 'graphql-request'
import Certificate from 'interfaces/certificate'
import Job from 'interfaces/job'
import Profile from 'interfaces/profile'
import Project from 'interfaces/project'
import Skill from 'interfaces/skill'

const initialPageQuery = gql`
  query InitialPageQuery {
    
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
