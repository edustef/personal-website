import Image from 'next/image';
import Border from '../components/Border';
import Description from '../components/Description';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import ProfileImage from '../components/ProfileImage';
import Projects from '../components/Projects';
import Section from '../components/Section';
import Skills from '../components/Skills';
import Timeline from '../components/Timeline';

export default function Home() {
  return (
    <Layout>
      <div className='px-4 mx-auto'>
        <ProfileImage />
        <div className='relative z-0 py-8'>
          <Border />
          <div className='relative z-20'>
            <Description />
            <Section title='Certificates'>
              <Timeline />
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
  );
}
