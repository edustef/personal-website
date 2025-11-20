import { certificate } from "./src/schemaTypes/documents/certificates";
import { job } from "./src/schemaTypes/documents/job";
import { project } from "./src/schemaTypes/documents/project";
import { skill } from "./src/schemaTypes/documents/skill";
import { button } from "./src/schemaTypes/objects/button";
import { duration } from "./src/schemaTypes/objects/duration";
import { milestone } from "./src/schemaTypes/objects/milestone";
import { socialLink } from "./src/schemaTypes/objects/socialLink";
import { timeline } from "./src/schemaTypes/objects/timeline";
import { home } from "./src/schemaTypes/singletons/home";
import { profile } from "./src/schemaTypes/singletons/profile";
import { settings } from "./src/schemaTypes/singletons/settings";

export const documentsSchemas = [certificate, job, project, skill];

export const singletonsSchemas = [home, settings, profile];

export const objectsSchemas = [
  milestone,
  timeline,
  duration,
  button,
  socialLink,
];

export const PREVIEWABLE_DOCUMENT_TYPES: string[] = [home.name];
