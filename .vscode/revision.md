# Revisión del portafolio (2026-10-21)

Primera parte: configuración, formulario de contacto, layout, header, hero, página de proyecto y estilos globales. El resto está en la segunda parte, más abajo. Los puntos resueltos se van borrando de esta lista.

## 🔴 Seguridad (formulario de contacto)

- [ ] **2. Turnstile: falta la configuración en Cloudflare.** El código ya está (widget `interaction-only` y verificación con `siteverify` en la action). Falta: crear el widget en Cloudflare, poner `TURNSTILE_SITE_KEY` como variable de build y `TURNSTILE_SECRET_KEY` como secreto del Worker, y añadir una regla de *Rate limiting* para `POST /_actions/sendEmail`. Sin las llaves, el formulario en producción rechaza todos los envíos.

## ⚪ Calidad y rendimiento

- [ ] **19. Remitente de pruebas `@resend.dev`.** `replyTo: email` ya está puesto. Falta verificar `dialmonsalve.com` en Resend (registros DNS en Cloudflare) y, después, cambiar `from` a `contacto@dialmonsalve.com`. Si se cambia antes de verificar, los correos fallan.

---

# Segunda parte (2026-10-21): resto del proyecto

Componentes, páginas de demo, i18n, contenido y scripts de `src/lib`.

## ⚪ Calidad y rendimiento

