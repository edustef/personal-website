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
  const { profile, certificates, projects, jobs, skills } = data

  return (
    <Layout title='Portofolio'>
      <div className='px-4 mx-auto'>
        <ProfileImage motto={profile.motto} picture={profile.picture} />
        <div className='relative z-0 py-8'>
          <Border />
          <div className='relative z-20'>
            <Description about={profile.about} />

            <Section title='Projects' twMaxWidth='max-w-7xl'>
              <Projects projects={projects} />
            </Section>

            <Section title='Skills' twMaxWidth='max-w-7xl'>
              <Skills />
            </Section>

            <Section title='Certificates' twMaxWidth='md:max-w-[80vw]'>
              <Certificates certificates={certificates} />
            </Section>
          </div>
        </div>
      </div>
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
