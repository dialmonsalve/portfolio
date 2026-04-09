/// <reference types="astro/client" />
/// <reference types="@astrojs/cloudflare" />

interface Env {
  RESEND_API_KEY: string;
}

// Esto permite que 'cloudflare:workers' sea reconocido
declare module "cloudflare:workers" {
  export const env: Env;
}