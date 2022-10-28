import { InferGetStaticPropsType } from 'next'
import fetchGQL from 'utils/fetchGQL'
import initialPageQuery, {
  InitialPageQueryType
} from 'queries/initialPageQuery'
import Layout from 'components/Layout'
import Page from 'components/Page'

export default function Home({
  data
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { metadata } = data
  return (
    <Page {...metadata}>
      <Layout>
        <h1>Hello World</h1>
      </Layout>
    </Page>
  )
}

export async function getStaticProps() {
  const { data, error } = await fetchGQL<InitialPageQueryType>(initialPageQuery)

  if (error)
    return {
      notFound: true
    }

  return {
    props: {
      data: data
    }
  }

  return {
    props: {}
  }
}

