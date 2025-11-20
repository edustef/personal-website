import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

export const homeQuery = defineQuery(`
  *[_type == "home"][0]{
    _id,
    title,
    headline,
    tagline,
    renovationLabelPrimary,
    renovationLabelSecondary,
    findMeOnLabel,
    resumeButtonLabel,
    ctaButtons[]{
      text,
      link{
        href,
        external
      }
    },
    profile->{
      name,
      email,
      phone,
      motto,
      about,
      location,
      picture,
      workPreference,
      socialLinks[]{
        platform,
        url
      }
    },
    featuredProjects[]->{
      _id,
      name,
      description,
      "image": coverImage,
      "technologies": skills[]->name,
      "link": websiteLink,
      "github": sourceLink,
      featured
    },
    footer
  }
`);

export const homeFooterQuery = defineQuery(`
  *[_type == "home"][0]{
    footer,
    profile->{
      name
    }
  }
`);

export const profileQuery = defineQuery(`
  *[_type == "profile"][0]{
    _id,
    name,
    email,
    phone,
    motto,
    about,
    location,
    picture,
    workPreference,
    socialLinks[]{
      platform,
      url
    }
  }
`);

export const resumeQuery = defineQuery(`
  *[_type == "resume"][0]{
    _id,
    title,
    description,
    showSkills,
    showProjects,
    showCertificates
  }
`);

export const allJobsQuery = defineQuery(`
  *[_type == "job"] | order(startDate desc){
    _id,
    position,
    company,
    location,
    startDate,
    endDate,
    "current": isCurrent,
    description,
    responsibilities,
    "technologies": skills[]->name
  }
`);

export const allProjectsQuery = defineQuery(`
  *[_type == "project"] | order(_createdAt desc){
    _id,
    name,
    description,
    "image": coverImage,
    "technologies": skills[]->name,
    "link": websiteLink,
    "github": sourceLink,
    featured,
    duration
  }
`);

export const allSkillsQuery = defineQuery(`
  *[_type == "skill"] | order(name asc){
    _id,
    name,
    type
  }
`);

export const allCertificatesQuery = defineQuery(`
  *[_type == "certificate"] | order(dateIssued desc)
`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
`;

const linkReference = /* groq */ `
  _type == "link" => {
    "post": post->slug.current
  }
`;

export const sitemapData = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`);

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content,
    ${postFields}
  }
`);

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`);
