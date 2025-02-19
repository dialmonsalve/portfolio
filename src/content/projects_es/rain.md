---
description: "Este proyecto es una aplicación web privada para los empleados de Sc Group"
href: "https://rain.scgroup.one/"
images: ["/images/rain.webp"]
isExternalProject: true
scripts: "typescript"
styles: "scss - sass"
technology: "Laravel"
title: "rain"
---

This project is a private web application for the employees of Sc Group, a company based in Puerto Rico with subsidiaries Skytel Puerto Rico and Truconnect. Among its franchises are Antoninos Pizza, Marble Slab Creamery, and Fatburger. This company is the only one authorized to sell these franchises in Puerto Rico.

La aplicación cuenta con aproximadamente 25 módulos, y 3 rutas administrativas creado todo ello por 3 desarrolladores:

1. Ruta para personal de telecomunicaciones
2. Ruta para personal de restaurantes
3. Ruta para personal administrativo

Las siguientes características han sido desarrollados por mi:

0. General

- Layout general

1. Modulo administrativo

- Usuarios
- Roles
- Pagos para usuarios
- Divisiones
- Requerimientos de permisos
- Tiendas
- Manejo de formularios dinámicos, este apartado se explica a continuación por su complejidad

### Formularios:

El módulo de formularios es totalmente dinámico, permitiendo al personal administrativo crearlos de manera dinámica y con una interfaz gráfica, permite crear campos de formularios como textos, numérico, imágenes, email, file; entre muchos otros esto con sus validaciones e inclusive con muchas funcionalidades que permiten los inputs. Este módulo fue creado para hacer encuestas a clientes por ejemplo, es la única ruta que es publica y el usuario podrá llenar la información cuando el personal administrativo compartan el link de dicho formulario. Este módulo lo hice fuertemente inspirado en https://www.jotform.com/, obviamente la proporción de esta aplicativo es mucho más amplio. Toda la funcionalidad está hecha en typescript puro sin ninguna librería, ni framework.

2. Módulo para restaurantes

- Manejo de proveedores
- Creación de inventarios para restaurantes
- Flujo de aprobación de inventarios
- Creación de ordenes de compra
