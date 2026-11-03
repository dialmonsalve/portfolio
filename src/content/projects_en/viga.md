---
description: "My HTTP framework for Node.js and TypeScript"
href: "https://vigajs.dev/en/"
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
slug: "viga"

pngImage: "/images/viga/main.png"
imageWidth: 1366
imageHeight: 768
webpImage: "/images/viga/main.webp"

metaTitle: "Diego Monsalve | viga, HTTP framework for Node.js (npm package)"
metaDescription: "viga, Diego Monsalve's HTTP framework for Node.js and TypeScript: modules, dependency injection and standard decorators, published on npm."
---

<p class="leading-7 my-4">viga is my HTTP framework for Node.js and TypeScript, built on top of Express 5. It organizes an API into modules, with dependency injection and standard JavaScript decorators, without <code>reflect-metadata</code> or <code>experimentalDecorators</code>. It's inspired by the ideas of NestJS, but shares no code with it.</p>

<p class="leading-7 my-4">It's published on npm as <a class="text-blue-500 dark:text-green-700" href="https://www.npmjs.com/package/@vigajs/core">@vigajs/core</a>, and the code is on <a class="text-blue-500 dark:text-green-700" href="https://github.com/dialmonsalve/viga">GitHub</a>. You start with a single command: <code>pnpm create @vigajs my-app</code>.</p>

<p class="leading-7 my-4">I designed it so every application starts closed: all routes are private until you decide to open them, and security headers, a body size limit and CSRF protection come turned on. Each value can be adjusted. The suite has more than 500 tests, and I tested the guides by running them in real applications.</p>

<p class="leading-7 my-4">The <a class="text-blue-500 dark:text-green-700" href="https://vigajs.dev/en/start/what-is-viga/">documentation</a> is in Spanish, English and Portuguese, built with Astro and Starlight, with light and dark modes, an API reference, a full tutorial and guides like JWT authentication, multi-tenant and queues.</p>

### Optional modules:

<ul class="px-4" >
  <li> - viga/config: validated, typed environment variables</li>
  <li> - viga/validation: validation with Zod, Valibot or ArkType</li>
  <li> - viga/testing: tests with real HTTP requests</li>
  <li> - viga/pagination: paginated lists with limits</li>
  <li> - viga/i18n: responses in each user's language</li>
  <li> - viga/drizzle: PostgreSQL with Drizzle ORM and transactions</li>
  <li> - viga/websocket: real time with rooms</li>
  <li> - viga/health: routes for Kubernetes and Docker</li>
  <li> - viga/crypto: passwords, tokens, signed URLs and encryption</li>
  <li> - viga/events: in-memory event bus</li>
  <li> - viga/workers: background work in other processes</li>
  <li> - viga/upload: file uploads with limits</li>
  <li> - viga/openapi: OpenAPI 3.1 document from the decorators</li>
</ul>
