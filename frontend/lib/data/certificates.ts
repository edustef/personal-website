export type Certificate = {
  _id: string;
  title: string;
  dateIssued: string;
  link: string;
  description: {
    en: string;
    ro?: string;
    es: string;
  };
};

export const certificates: Certificate[] = [
  {
    _id: "a0e1ad88-72ae-4bc4-a8c5-ab8b139d6533",
    title: "Responsive Web Design",
    dateIssued: "2019-12-28",
    link: "https://www.freecodecamp.org/certification/edustef/responsive-web-design",
    description: {
      en: "FreeCodeCamp certificate for Responsive Design representing approximately 300 hours of coursework.\n\nKey concepts:\n- Flexbox and Grid\n- Mobile-first / desktop-first design\n- Responsive design using media queries\n- Accessibility and best practices",
      es: "Certificado FreeCodeCamp para el Diseño Responsive que equivale a unas 300 horas de curso.\n\nConceptos clave:\n- Flexbox y Grid\n- Diseño mobile-first / desktop-first\n- Diseño responsivo usando media queries\n- Accesibilidad y buenas prácticas",
    },
  },
  {
    _id: "4baf555f-1be8-45a2-98fe-ddaeeea25182",
    title: "JavaScript Algorithms and Data Structures",
    dateIssued: "2021-10-08",
    link: "https://www.freecodecamp.org/certification/edustef/javascript-algorithms-and-data-structures",
    description: {
      en: "FreeCodeCamp certificate for Javascript Algorithms and Data Structures representing approximately 300 hours of coursework.\n\nKey concepts:\n- Learned JavaScript with the latest version ECMAScript 2021\n- Data structures and algorithms\n- Testing and debugging\n- Functional programming",
      es: "Certificado FreeCodeCamp para Algoritmos y Estructuras de Datos en Javascript que equivale a unas 300 horas de curso.\n\nConceptos clave:\n- Aprendizaje de Javascript con la última versión ECMAScript 2021\n- Estructuras de datos y algoritmos\n- Pruebas y depuración\n- Programación funcional",
    },
  },
  {
    _id: "e4d2bb74-a579-4aec-96fa-adfcf7d49933",
    title: "NodeJS - The Complete Course",
    dateIssued: "2021-07-21",
    link: "https://www.udemy.com/certificate/UC-de2cd267-45b9-4bb9-a21e-30d989552a55/",
    description: {
      en: "",
      es: "",
    },
  },
  {
    _id: "45c91944-866a-46c7-9a1f-fdc11460adba",
    title: "React - The Complete Guide",
    dateIssued: "2021-08-18",
    link: "https://www.udemy.com/certificate/UC-59caf68b-de30-4557-8b7b-aa06d6c70d49/",
    description: {
      en: "A 48-hour course on React and how to build fully-fledged SPAs.\n\nKey concepts:\n- Design independent and reusable components\n- Creating custom React Hooks\n- Styled Components and CSS Modules\n- Using React with Redux as a state management\n- NextJS and TypeScript",
      es: "Un curso de 48 horas sobre React y cómo desarrollar SPAs completas.\n\nConceptos clave:\n- Diseñar componentes independientes y reutilizables\n- Creación de React Hooks personalizados\n- Componentes con estilo y módulos CSS\n- Uso de React con Redux como gestión de estados\n- NextJS y TypeScript",
    },
  },
  {
    _id: "5d179a2f-74d2-4b5a-8f1d-194036f10c61",
    title: "The Web Development Bootcamp",
    dateIssued: "2019-11-16",
    link: "https://www.udemy.com/certificate/UC-JY8G69HR/",
    description: {
      en: "My first course where I learned the basic of web development.\n\nKey concepts:\n- Semantic and responsive design with **HTML** and **CSS**\n- Interactive pages and calling **APIs** asynchronously using **JavaScript**.\n- Coding a web server using **ExpressJS**, **MongoDB** and **MySQL**\n- Authentication, cookies, authorization, sessions\n- Common security issues and how to avoid them",
      es: "Mi primer curso donde aprendí lo básico del desarrollo web.\n\nConceptos clave:\n- Diseño semántico y responsivo con **HTML** y **CSS**\n- Páginas interactivas y lllamadas asíncronas a la **API** usando **JavaScript**.\n- Codificación de un servidor web usando **ExpressJS**, **MongoDB** y **MySQL**\n- Autenticación, cookies, autorización, sesiones\n- Problemas comunes de seguridad y cómo evitarlos",
    },
  },
].sort((a, b) => new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime());

