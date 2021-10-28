import { System } from './system'

export default interface Asset extends System {
  fileName: string
  mimeType: string
  height: number
  width: number
  size: number
  alternativeText: string
  url: string
}
