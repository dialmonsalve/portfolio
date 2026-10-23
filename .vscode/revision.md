# Revisión del portafolio (2026-10-21)

Primera parte: configuración, formulario de contacto, layout, header, hero, página de proyecto y estilos globales. El resto está en la segunda parte, más abajo. Los puntos resueltos se van borrando de esta lista.

## 🔴 Seguridad (formulario de contacto)

- [ ] **2. Turnstile: falta el Rate limiting.** El widget y la verificación ya están en producción (la *Site Key* va fija en `ContactForm.astro` porque es pública; la secreta es el secreto `TURNSTILE_SECRET_KEY` del Worker). Falta añadir una regla de *Rate limiting* en Cloudflare para `POST /_actions/sendEmail`.

## ⚪ Calidad y rendimiento

- [ ] **19. Remitente de pruebas `@resend.dev`.** `replyTo: email` ya está puesto. Falta verificar `dialmonsalve.com` en Resend (registros DNS en Cloudflare) y, después, cambiar `from` a `contacto@dialmonsalve.com`. Si se cambia antes de verificar, los correos fallan.

---

# Segunda parte (2026-10-21): resto del proyecto

Componentes, páginas de demo, i18n, contenido y scripts de `src/lib`.

## ⚪ Calidad y rendimiento

