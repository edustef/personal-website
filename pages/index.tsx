import Border from 'components/Border'
import Description from 'components/Description'
import Footer from 'components/Footer'
import Layout from 'components/Layout'
import ProfileImage from 'components/ProfileImage'
import Projects from 'components/Projects'
import Section from 'components/Section'
import Skills from 'components/Skills'
import Certificates from 'components/Certificates'
import { InferGetStaticPropsType } from 'next'
import fetchGQL from 'utils/fetchGQL'
import initialPageQuery, {
  InitialPageQueryType
} from 'queries/initialPageQuery'

export default function Home({
  data
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout title='Portofolio'>
      <h1>Hello World</h1>
      <Footer />
    </Layout>
  )
}

export async function getStaticProps() {
  try {
    const data = await fetchGQL<InitialPageQueryType>(initialPageQuery)
    return {
      props: {
        data: data
      }
    }
  } catch (err) {
    console.log(err.networkError.result)
  }

  return {
    props: {}
  }
}
