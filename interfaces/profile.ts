import Asset from './asset'
import { System } from './system'

export default interface Profile extends System {
  name: string
  email: string
  motto: string
  location: string
  phone: string
  about: string
  picture: Asset
}
