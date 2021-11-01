import { DocumentNode } from 'graphql'
import apolloClient from './apolloClient'

const fetchGQL = async <T>(query: DocumentNode) => {
  const { data } = await apolloClient.query<T>({
    query
  })

  return data
}

export default fetchGQL
