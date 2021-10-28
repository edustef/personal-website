import { System } from './system'
import Project from './project'
import TagColor from './tagColor'

export default interface Skill extends System {
  name: string
  projects: Project[]
  tagColor: TagColor
}
