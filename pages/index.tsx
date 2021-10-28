import Border from 'components/Border'
import Description from 'components/Description'
import Footer from 'components/Footer'
import Layout from 'components/Layout'
import ProfileImage from 'components/ProfileImage'
import Projects from 'components/Projects'
import Section from 'components/Section'
import Skills from 'components/Skills'
import Certificates from 'components/Certificates'
import apolloClient from '../utils/apolloClient'
import gql from 'graphql-tag'
import { Certificate } from 'crypto'
import Profile from 'interfaces/profile'
import { InferGetStaticPropsType } from 'next'
import Project from 'interfaces/project'
import Skill from 'interfaces/skill'
import Job from 'interfaces/job'

export default function Home({ data }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { profile, certificates, projects, jobs, skills } = data

  return (
    <Layout>
      <div className='px-4 mx-auto'>
        <ProfileImage motto={profile.motto} url={profile.picture.url} />
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
  const { data } = await apolloClient.query<{
    certificates: Certificate[]
    profile: Profile
    projects: Project[]
    skills: Skill[]
    jobs: Job[]
  }>({
    query: gql`
      query getData {
        profile(where: { id: "ckv9gcv4w9y7x0c089b6fe7e3" }) {
          id
          name
          about
          motto
          picture {
            id
            url
            width
            height
          }
        }

        certificates {
          id
          title
          description
          dateIssued
          link
        }
        skills {
          id
          name
          projects {
            id
            slug
            name
          }
        }
        projects {
          id
          name
          description
          duration
          sourceUrl
          siteUrl
          slug
          skills {
            id
            name
            tagColor {
              name
              value
            }
          }
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
