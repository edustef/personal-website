import Border from '../components/Border'
import Description from '../components/Description'
import Footer from '../components/Footer'
import Layout from '../components/Layout'
import ProfileImage from '../components/ProfileImage'
import Projects from '../components/Projects'
import Section from '../components/Section'
import Skills from '../components/Skills'
import Certificates from '../components/Certificates'
import client from '../utils/apollo-client'
import gql from 'graphql-tag'

export default function Home({ data }) {
  const { profile, certificates } = data
  return (
    <Layout>
      <div className='px-4 mx-auto'>
        <ProfileImage />
        <div className='relative z-0 py-8'>
          <Border />
          <div className='relative z-20'>
            <Description profile={profile} />

            <Section title='Certificates' twMaxWidth='md:max-w-[80vw]'>
              <Certificates certificates={certificates} />
            </Section>

            <Section title='Skills' twMaxWidth='max-w-7xl'>
              <Skills />
            </Section>

            <Section title='Projects' twMaxWidth='max-w-7xl'>
              <Projects />
            </Section>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  )
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query Query {
        certificates {
          id
          title
          description
          dateIssued
          link
        }
        profile {
          aboutMe
        }
      }
    `
  })

  return {
    props: {
      data: data
    }
  }
}
