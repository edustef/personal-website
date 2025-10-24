# Internationalization Setup

This document describes the internationalization (i18n) setup for your personal website using the [sanity-plugin-internationalized-array](https://github.com/sanity-io/sanity-plugin-internationalized-array) plugin.

## Languages Configured

The website supports three languages:

- **English (en)** - Default language
- **Romanian (ro)**
- **Spanish (es)**

## Studio Configuration

### Plugin Setup

The `sanity-plugin-internationalized-array` is already installed and configured in `studio/sanity.config.ts`:

```typescript
internationalizedArray({
  languages: [
    { id: "en", title: "English" },
    { id: "ro", title: "Romanian" },
    { id: "es", title: "Spanish" },
  ],
  defaultLanguages: ["en"],
  fieldTypes: ["string", "blockContent"],
});
```

### Internationalized Schema Fields

The following schema fields have been updated to use internationalized arrays:

#### Home Singleton (`studio/src/schemaTypes/singletons/home.ts`)

- `title` - `internationalizedArrayString`
- `headline` - `internationalizedArrayString`
- `tagline` - `internationalizedArrayString`

#### Profile Document (`studio/src/schemaTypes/documents/profile.ts`)

- `motto` - `internationalizedArrayString`
- `about` - `internationalizedArrayString`
- `location` - `internationalizedArrayString`
- `workPreference` - `internationalizedArrayString`

#### Post Document (`studio/src/schemaTypes/documents/post.ts`)

- `title` - `internationalizedArrayString`
- `excerpt` - `internationalizedArrayString`
- `content` - `internationalizedArrayBlockContent`

#### Project Document (`studio/src/schemaTypes/documents/project.ts`)

- `name` - `internationalizedArrayString`
- `description` - `internationalizedArrayBlockContent`

#### Job Document (`studio/src/schemaTypes/documents/job.ts`)

- `position` - `internationalizedArrayString`
- `description` - `internationalizedArrayBlockContent`

#### Certificate Document (`studio/src/schemaTypes/documents/certificates.ts`)

- `title` - `internationalizedArrayString`
- `description` - `internationalizedArrayBlockContent`

#### Resume Singleton (`studio/src/schemaTypes/singletons/resume.ts`)

- `title` - `internationalizedArrayString`
- `description` - `internationalizedArrayString`

#### Button Object (`studio/src/schemaTypes/objects/button.ts`)

- `text` - `internationalizedArrayString`

## Frontend Implementation

### Language Utility (`frontend/app/lib/i18n.ts`)

A utility module has been created to handle localized content extraction:

**Key functions:**

- `getLocalizedString(field, language)` - Extracts a localized string value
- `getLocalizedBlockContent(field, language)` - Extracts localized block content (Portable Text)

**Features:**

- Automatically falls back to the default language (English) if the requested language is not available
- Falls back to the first available language if neither the requested nor default language is available
- Handles both internationalized and non-internationalized content gracefully

### Data Structure

Internationalized data is stored as arrays with language-specific keys:

```javascript
// String field example
{
  "headline": [
    { "_key": "en", "value": "Hello World" },
    { "_key": "ro", "value": "Salut Lume" },
    { "_key": "es", "value": "Hola Mundo" }
  ]
}

// Block content example
{
  "content": [
    { "_key": "en", "value": [...portableTextBlocks] },
    { "_key": "ro", "value": [...portableTextBlocks] },
    { "_key": "es", "value": [...portableTextBlocks] }
  ]
}
```

### Updated Components

The following components have been updated to use the localization utilities:

1. **HeroSection** (`frontend/app/components/HeroSection.tsx`)
   - Localizes headline, tagline, profile motto, and CTA button text

2. **ProjectGrid** (`frontend/app/components/ProjectGrid.tsx`)
   - Localizes project names and descriptions

3. **Posts** (`frontend/app/components/Posts.tsx`)
   - Localizes post titles and excerpts

4. **Post Page** (`frontend/app/posts/[slug]/page.tsx`)
   - Localizes post title, excerpt, and content
   - Metadata properly localized for SEO

5. **Resume Page** (`frontend/app/resume/page.tsx`)
   - Localizes resume title, description, profile info, job positions, project names, and certificate titles

### GROQ Queries

The queries in `frontend/sanity/lib/queries.ts` have been updated to fetch the raw internationalized array data. The localization is now handled on the frontend using the utility functions.

## Usage in Studio

When editing content in the Sanity Studio:

1. Click on any internationalized field
2. You'll see language-specific input fields for English, Romanian, and Spanish
3. Fill in content for each language you want to support
4. The "Add all languages" button can be used to quickly add all language variants

## Adding New Languages

To add a new language:

1. Update `studio/sanity.config.ts`:

   ```typescript
   languages: [
     {id: 'en', title: 'English'},
     {id: 'ro', title: 'Romanian'},
     {id: 'es', title: 'Spanish'},
     {id: 'fr', title: 'French'}, // Add new language
   ],
   ```

2. Update `frontend/app/lib/i18n.ts`:
   ```typescript
   export const languages = [
     { id: "en", title: "English" },
     { id: "ro", title: "Romanian" },
     { id: "es", title: "Spanish" },
     { id: "fr", title: "French" }, // Add new language
   ] as const;
   ```

## Next Steps

To make the website fully multilingual, you could:

1. **Add Language Switcher**: Create a UI component to let users switch between languages
2. **URL-based Language Routing**: Use Next.js internationalized routing (`/en/`, `/ro/`, `/es/`)
3. **Language Detection**: Automatically detect user's preferred language from browser settings
4. **Per-page Language State**: Store the selected language in context or state management
5. **Static Labels**: Internationalize UI labels, buttons, and static text using a solution like `next-intl`

## Current Language

Currently, the website is hardcoded to display English (`'en'`) content. To change this:

1. Update all `getLocalizedString(field, 'en')` calls to use a dynamic language variable
2. Implement a language context provider
3. Pass the current language throughout your component tree

## Migration

If you have existing content that needs to be migrated to the internationalized format, you can use the migration script in `studio/migrations/transformObjectToArray.ts` as a reference.

## Resources

- [sanity-plugin-internationalized-array Documentation](https://github.com/sanity-io/sanity-plugin-internationalized-array)
- [Sanity Content Lake Schema Best Practices](https://www.sanity.io/docs/schema-types)
- [Next.js Internationalized Routing](https://nextjs.org/docs/advanced-features/i18n-routing)
