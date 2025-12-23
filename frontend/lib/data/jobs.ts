import type { StaticImageData } from "next/image";
import cosentinoLogo from "@/assets/images/cosention-logo.png";
import swissborgLogo from "@/assets/images/swissborg-logo.png";

export type Job = {
  _id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: {
    en: string;
    ro: string;
    es: string;
  };
  logo: StaticImageData;
  skills: string[];
};

export const jobs: Job[] = [
  {
    _id: "7dd627c1-777c-46cd-8321-58170dd47f64",
    position: "Intern Front-end Developer",
    company: "Cosentino",
    startDate: "2021-04-01",
    endDate: "2021-06-30",
    isCurrent: false,
    description: {
      en: "- Completed a three-month internship, working on a project to create an internal web page for employees to request items from company warehouses.\n- Accessed inventory database, monitored stock levels, and managed requests using established microservices.\n- Learned and applied the Kendo UI library, following the project's coding and design guidelines.\n- Implemented authentication and authorization features on the front-end, ensuring user privacy for request history and ongoing requests.",
      ro: "- Am finalizat un stagiu de trei luni, lucrând la un proiect pentru crearea unei pagini web interne destinată angajaților pentru solicitarea de articole din depozitele companiei\n- Am accesat baza de date de inventar, am monitorizat nivelurile de stoc și am gestionat cererile folosind microserviciile stabilite\n- Am învățat și am aplicat biblioteca Kendo UI, respectând liniile directoare de codificare și design ale proiectului\n- Am implementat funcționalități de autentificare și autorizare pe front-end, asigurând confidențialitatea utilizatorilor pentru istoricul cererilor și cererile în curs",
      es: "- Completé una pasantía de tres meses, trabajando en un proyecto para crear una página web interna para que los empleados soliciten artículos de los almacenes de la empresa\n- Accedí a la base de datos de inventario, monitoricé los niveles de stock y gestioné las solicitudes utilizando microservicios establecidos\n- Aprendí y apliqué la biblioteca Kendo UI, siguiendo las pautas de codificación y diseño del proyecto\n- Implementé características de autenticación y autorización en el front-end, asegurando la privacidad del usuario para el historial de solicitudes y las solicitudes en curso",
    },
    logo: cosentinoLogo,
    skills: ["TypeScript", "REST APIs"],
  },
  {
    _id: "1a41ec49-04d9-4500-ac41-61cd9ddb98a9",
    position: "Front-end Developer",
    company: "SwissBorg",
    startDate: "2021-11-17",
    endDate: "2025-09-30",
    isCurrent: false,
    description: {
      en: "- Worked closely with designers and product managers to bring design into high quality and production-ready features\n- Developed reusable components that integrate with Headless CMS which made independent page building possible.\n- Implemented Storybook into the codebase for better development and having a single source of truth\n- Worked with latest React tools and features (ESNext, React functional components, hooks, Webpack, Vite, etc.)",
      ro: "- Am lucrat îndeaproape cu designerii și managerii de produs pentru a transforma designul în funcționalități de înaltă calitate și gata pentru producție\n- Am dezvoltat componente reutilizabile care se integrează cu Headless CMS, ceea ce a făcut posibilă construirea independentă a paginilor\n- Am implementat Storybook în codul sursă pentru o dezvoltare mai bună și pentru a avea o singură sursă de adevăr\n- Am lucrat cu cele mai noi instrumente și funcționalități React (ESNext, componente funcționale React, hooks, Webpack, Vite, etc.)",
      es: "- Trabajé estrechamente con diseñadores y gerentes de producto para convertir el diseño en características de alta calidad y listas para producción\n- Desarrollé componentes reutilizables que se integran con Headless CMS, lo que hizo posible la construcción independiente de páginas\n- Implementé Storybook en el código base para un mejor desarrollo y tener una única fuente de verdad\n- Trabajé con las herramientas y características más recientes de React (ESNext, componentes funcionales de React, hooks, Webpack, Vite, etc.)",
    },
    logo: swissborgLogo,
    skills: ["NextJS", "GatsbyJS", "GraphQL", "TypeScript", "Headless CMS", "Storybook"],
  },
].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

