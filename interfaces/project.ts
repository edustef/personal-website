import Asset from './asset'
import { System } from './system'
import Skill from './skill'

export default interface Project extends System {
  name: string
  description: string
  image: Asset
  duration: string
  sourceUrl: string
  siteUrl: string
  skills: Skill[]
}
