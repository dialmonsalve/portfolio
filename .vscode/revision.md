# Revisión del portafolio (2026-10-21)

Primera parte: configuración, formulario de contacto, layout, header, hero, página de proyecto y estilos globales. El resto está en la segunda parte, más abajo. Los puntos resueltos se van borrando de esta lista.

## 🔴 Seguridad (formulario de contacto)

- [ ] **2. Sin anti-bots ni límite de envíos.** Añadir Cloudflare Turnstile (botón deshabilitado hasta tener token, verificación en el servidor con `siteverify`) y una regla de *Rate limiting* en Cloudflare para la ruta de la action. Para no tocar el diseño: `appearance: "interaction-only"`, pendiente de confirmar.

## ⚪ Calidad y rendimiento

- [ ] **19. Remitente de pruebas `@resend.dev`.** `replyTo: email` ya está puesto. Falta verificar `dialmonsalve.com` en Resend (registros DNS en Cloudflare) y, después, cambiar `from` a `contacto@dialmonsalve.com`. Si se cambia antes de verificar, los correos fallan.

---

# Segunda parte (2026-10-21): resto del proyecto

Componentes, páginas de demo, i18n, contenido y scripts de `src/lib`.

## ⚪ Calidad y rendimiento

- [ ] **40. Carrusel sin usar**: `Carousel.astro` y `mini-carousel.ts` (import comentado en la portada). Pendiente de decidir si se borra o se recupera. Si se recupera, a las flechas les falta `aria-label`, el título debe ser `h2` y "Ir" está sin traducir.
- [ ] **41. El scroll del constructor de formularios no funciona**: [smoothWindow.ts](../src/lib/forms/utils/smoothWindow.ts), [navigateInPage.ts](../src/lib/forms/utils/navigateInPage.ts) y `smooth()` en [forms/index.ts](../src/lib/forms/index.ts) llaman a `main.scrollTo()`, pero `<main>` no tiene scroll propio, así que no hacen nada. Deberían desplazar `window`.
