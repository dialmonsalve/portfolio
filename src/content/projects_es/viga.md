---
description: "Mi framework HTTP para Node.js y TypeScript"
href: "https://vigajs.dev/es/"
images:
  [
    "/images/viga/webp/1.webp",
    "/images/viga/webp/2.webp",
    "/images/viga/webp/3.webp",
    "/images/viga/webp/4.webp",
    "/images/viga/webp/5.webp",
    "/images/viga/webp/6.webp",
  ]
isExternalProject: true
scripts: "TypeScript"
styles: "CSS"
technology: "Node"
title: "viga"
pngImage: "/images/viga/main.png"
imageWidth: 1366
imageHeight: 768
webpImage: "/images/viga/main.webp"
slug: "viga"

metaTitle: "Diego Monsalve | viga, framework HTTP para Node.js (paquete npm)"
metaDescription: "viga, el framework HTTP para Node.js y TypeScript de Diego Monsalve: módulos, inyección de dependencias y decoradores estándar, publicado en npm."
---

<p class="leading-7 my-4">viga es mi framework HTTP para Node.js y TypeScript, construido sobre Express 5. Organiza una API en módulos, con inyección de dependencias y decoradores estándar de JavaScript, sin <code>reflect-metadata</code> ni <code>experimentalDecorators</code>. Está inspirado en las ideas de NestJS, pero no comparte código con él.</p>

<p class="leading-7 my-4">Está publicado en npm como <a class="text-blue-500 dark:text-green-700" href="https://www.npmjs.com/package/@vigajs/core">@vigajs/core</a>, y el código está en <a class="text-blue-500 dark:text-green-700" href="https://github.com/dialmonsalve/viga">GitHub</a>. Se empieza con un solo comando: <code>pnpm create @vigajs mi-app</code>.</p>

<p class="leading-7 my-4">Lo diseñé para que cada aplicación parta cerrada: todas las rutas son privadas hasta que decides abrirlas, y trae activadas las cabeceras de seguridad, un límite de tamaño del cuerpo y la protección CSRF. Cada valor se puede ajustar. La suite tiene más de 500 tests, y las guías las probé ejecutándolas en aplicaciones reales.</p>

<p class="leading-7 my-4">La <a class="text-blue-500 dark:text-green-700" href="https://vigajs.dev/es/start/what-is-viga/">documentación</a> está en español, inglés y portugués, hecha con Astro y Starlight, con modo claro y oscuro, referencia de la API, un tutorial completo y guías como autenticación con JWT, multi-tenant y colas.</p>

### Módulos opcionales:

<ul class="px-4" >
  <li> - viga/config: variables de entorno validadas y tipadas</li>
  <li> - viga/validation: validación con Zod, Valibot o ArkType</li>
  <li> - viga/testing: pruebas con peticiones HTTP reales</li>
  <li> - viga/pagination: listados paginados con límites</li>
  <li> - viga/i18n: respuestas en el idioma de cada usuario</li>
  <li> - viga/drizzle: PostgreSQL con Drizzle ORM y transacciones</li>
  <li> - viga/websocket: tiempo real con salas</li>
  <li> - viga/health: rutas para Kubernetes y Docker</li>
  <li> - viga/crypto: contraseñas, tokens, URLs firmadas y cifrado</li>
  <li> - viga/events: bus de eventos en memoria</li>
  <li> - viga/workers: trabajo en segundo plano en otros procesos</li>
  <li> - viga/upload: subida de archivos con límites</li>
  <li> - viga/openapi: documento OpenAPI 3.1 a partir de los decoradores</li>
</ul>
