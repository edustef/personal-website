import { System } from './system'

export default interface Job extends System {
  company: string
  position: string
  description: string
  start: string
  end: string
  isWorkingHere: boolean
}
