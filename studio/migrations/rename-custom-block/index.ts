import {defineMigration, at, set} from 'sanity/migrate'

const oldType = 'internationalizedArrayCustomBlockValue'
const newType = 'internationalizedArrayBlockContentValue'

export default defineMigration({
  title: 'Rename custom block to blockContent',

  migrate: {
    object(object, path, context) {
      if (object._type === oldType) {
        return at('_type', set(newType))
      }
    }
  }
})
