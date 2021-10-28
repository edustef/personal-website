import { System } from './system'

export default interface Certificate extends System {
  title: string
  dateIssued: string
  link: string
  description: string
}
