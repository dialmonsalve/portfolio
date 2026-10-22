# Revisión del portafolio (2026-10-21)

Primera parte: configuración, formulario de contacto, layout, header, hero, página de proyecto y estilos globales. El resto está en la segunda parte, más abajo. Los puntos resueltos se van borrando de esta lista.

## 🔴 Seguridad (formulario de contacto)

- [ ] **2. Sin anti-bots ni límite de envíos.** Añadir Cloudflare Turnstile (botón deshabilitado hasta tener token, verificación en el servidor con `siteverify`) y una regla de *Rate limiting* en Cloudflare para la ruta de la action. Para no tocar el diseño: `appearance: "interaction-only"`, pendiente de confirmar.

## 🟠 SEO

- [ ] **7. Recursos inexistentes**: `og-image.jpg`, `twitter-image.jpg`, `favicon.ico` y `apple-touch-icon.png` no están en `public/`. Las etiquetas ya apuntan a `https://dialmonsalve.com/...`; solo faltan los archivos.

## 🟡 Accesibilidad y UX

- [ ] **11. Textarea con `text-white` fijo** — [src/components/pages/home/ContactForm.astro](../src/components/pages/home/ContactForm.astro): invisible en tema claro.
- [ ] **12. Formulario a medio traducir**: etiquetas, mensajes de Zod, "Enviando…" y el mensaje de éxito fijos en español; la etiqueta "Description" en inglés en la versión española.
- [ ] **13. El contenido está fuera de `<main>`**: el `<slot />` va después de `</main>` en el layout. Al moverlo hay que llevar `pt-14 p-1 lg:pt-10` a otro elemento para que no cambie el espaciado.
- [ ] **15. El selector de tema marca `light` por defecto** aunque [public/js/theme.js](../public/js/theme.js) aplique el tema del sistema.
- [ ] **16. Botón de la 404 con `history.back()`**: si se llega desde Google saca de la web. Mejor enlace al inicio.
- [ ] **17. Foto del hero sin `width`/`height`** (salto de contenido al cargar) y `alt` poco descriptivo ("Foto de Diego Monsalve").

## ⚪ Calidad y rendimiento

- [ ] **19. Remitente de pruebas `@resend.dev`.** `replyTo: email` ya está puesto. Falta verificar `dialmonsalve.com` en Resend (registros DNS en Cloudflare) y, después, cambiar `from` a `contacto@dialmonsalve.com`. Si se cambia antes de verificar, los correos fallan.

---

# Segunda parte (2026-10-21): resto del proyecto

Componentes, páginas de demo, i18n, contenido y scripts de `src/lib`.

## 🔴 Errores que rompen algo

- [ ] **22. Los `dark:` de Tailwind no siguen al selector de tema.** No hay `@custom-variant dark` en [src/styles/global.css](../src/styles/global.css), así que `dark:` depende del sistema operativo y no de `data-theme`. Si alguien elige oscuro con el sistema en claro, quedan las tarjetas `bg-white` de *Acerca de*, los textos `dark:text-gray-300`, etc. Solución: `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`.
- [ ] **24. Etiqueta `<di>` en lugar de `<div>`** — [src/components/web-components/MultiTabs.astro](../src/components/web-components/MultiTabs.astro).
- [ ] **25. Tema al navegar con `ClientRouter`** (verificar en el navegador): el `<html>` del servidor no trae `data-theme` y el router reemplaza los atributos del `<html>` en cada navegación, así que el tema elegido puede perderse o parpadear. Reaplicarlo en `astro:after-swap`.

## 🟡 Accesibilidad y UX

- [ ] **28. Controles que no se pueden usar con teclado**, porque el `input` real tiene `display:none`:
  - zona para soltar imágenes de [DownloadImages.astro](../src/components/DownloadImages.astro) (`class="hidden"` en el `input file`);
  - el botón del menú de [FormMenu.astro](../src/components/FormMenu.astro) (checkbox oculto y `label` vacío, sin nombre accesible);
  - los radios `.radio { display: none }` de [form.astro](../src/pages/[lang]/projects/form.astro).

  Usar la clase `sr-only` en lugar de ocultar, y añadir `:focus-visible` al `label`.
- [ ] **31. Iconos blancos invisibles en tema claro** — [Footer.astro](../src/components/layout/Footer.astro): LinkedIn (`text-white`) y GitHub (`fill:white`) sobre `bg-base-300`. Además, `fap-1` debe ser `gap-1`, y las marcas se escriben "LinkedIn" y "GitHub".
- [ ] **32. Textos fijos sin traducir**:
  - "add page" (formularios);
  - "Press Enter… / Press kye up…" (con errata "kye");
  - "Elija sus opciones" y "¡Todas las opciones han sido seleccionadas!" (multiselect);
  - "1 archivo seleccionado / N archivos seleccionado" (falta la "s" y está en español también en la versión inglesa);
  - "WEBP, PNG, JPEG O JPG" (falta AVIF, que sí se acepta);
  - "Icons from: iconos8" (la marca es Icons8).
- [ ] **33. `Technologies.astro`**:
  - sobra la prop `aria-label` en `<Icon>` (no la acepta, y el icono ya es `aria-hidden`);
  - el nombre se lee dos veces (tooltip y etiqueta);
  - `cursor-pointer` en elementos no interactivos;
  - texto de `8px` en móvil, ilegible;
  - `xl.mt-20` debe ser `xl:mt-20`.
- [ ] **34. Elementos con apariencia de botón que no hacen nada**: los *badges* de habilidades en *Acerca de* (`cursor-pointer` y hover) y las tarjetas de tecnologías.
- [ ] **35. Imágenes de las tarjetas sin `width`/`height` ni `loading="lazy"`**, y `<source>` sin `type="image/webp"` en [Card.astro](../src/components/Card.astro). El enlace "más" usa una ruta relativa (`projects/${slug}`) que se rompe si la URL termina en `/`.
- [ ] **37. El FAB arranca con `opacity: 0` y fuera de la pantalla**: si GSAP falla o el usuario tiene `prefers-reduced-motion`, el menú no aparece. Respetar `prefers-reduced-motion` también en el resto de animaciones.

## ⚪ Calidad y rendimiento

- [ ] **40. Carrusel sin usar**: `Carousel.astro` y `mini-carousel.ts` (import comentado en la portada). Pendiente de decidir si se borra o se recupera. Si se recupera, a las flechas les falta `aria-label`, el título debe ser `h2` y "Ir" está sin traducir.
