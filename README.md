# Portfolio

Personal portfolio of Diego Monsalve, live at [dialmonsalve.com](https://dialmonsalve.com), in Spanish and English, with light and dark themes. It shows my projects, an about page and a contact form.

## Stack

- [Astro](https://astro.build) with the Cloudflare adapter.
- [Tailwind CSS](https://tailwindcss.com) and [daisyUI](https://daisyui.com) for styles.
- [GSAP](https://gsap.com) for animations.
- [Resend](https://resend.com) and Cloudflare Turnstile for the contact form.

## Getting started

It needs Node.js 22.12 or later and pnpm.

```sh
pnpm install
pnpm dev
```

The site runs at `http://localhost:4321`.

### Environment variables

The contact form reads these from a `.env` file, which Git ignores. Both are optional for working on the rest of the site.

| Variable | What it's for |
| --- | --- |
| `RESEND_API_KEY` | Sends the contact form's email. |
| `TURNSTILE_SECRET_KEY` | Verifies the form's Cloudflare Turnstile challenge. |

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Starts the dev server. |
| `pnpm build` | Builds the site into `dist/`. |
| `pnpm preview` | Previews the build locally. |
| `pnpm astro ...` | Runs Astro CLI commands. |

## Structure

| Path | Content |
| --- | --- |
| `src/pages/[lang]/` | Pages for each language: home, about and projects. |
| `src/pages/[lang]/projects/` | Project list, the page for each project, and the internal projects. |
| `src/content/projects_es/`, `src/content/projects_en/` | One Markdown file per project and language. |
| `src/i18n/locales/` | Interface text, including the internal projects. |
| `src/components/` | Interface components, form builder and web components. |
| `src/actions/` | Server action for the contact form. |
| `public/images/` | Project images. |

## Add a project

1. Add `src/content/projects_es/<slug>.md` and `src/content/projects_en/<slug>.md`. `src/content.config.ts` defines the required fields.
2. Add its images to `public/images/<slug>/`:
   - `main.png` and `main.webp`, shown on the project card.
   - `png/1.png`, `webp/1.webp` and so on, shown as the gallery on the project page.
3. List the WebP images in the `images` field, in order. The gallery uses that list to know how many images there are.

The project appears in the list and gets its own page at `/<lang>/projects/<slug>`.

## Deployment

The site runs on Cloudflare, configured in `wrangler.jsonc`.
