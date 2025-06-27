---
description: "This project is a private web application for the employees of Sc Group"
href: "https://rain.scgroup.one/"
images:
  [
    "/images/rain/webp/1.webp",
    "/images/rain/webp/2.webp",
    "/images/rain/webp/3.webp",
    "/images/rain/webp/4.webp",
    "/images/rain/webp/5.webp",
    "/images/rain/webp/6.webp",
    "/images/rain/webp/7.webp",
  ]
isExternalProject: true
scripts: "typescript"
styles: "css"
technology: "Laravel"
title: "rain"
pngImage: "/images/rain/main.png"
webpImage: "/images/rain/main.webp"

metaTitle: "Diego Monsalve | Laravel Business Management Application"
metaDescription: "See Diego Monsalve's professional Laravel project: a comprehensive internal application streamlining inventory, permit requests, and agenda management for a company."
---

<p class="leading-7 my-4" >
This project is a private web application for the employees of Sc Group, a company based in Puerto Rico with subsidiaries Skytel Puerto Rico and Truconnect. Among its franchises are Antoninos Pizza, Marble Slab Creamery, and Fatburger. This company is the only one authorized to sell these franchises in Puerto Rico.
</p>

<p class="leading-7 my-4" >
The application consists of approximately 25 modules, and 3 administrative routes, all created by 3 developers:
</p>

<ol class="px-4" >
  <li> 1. Route for telecommunications personnel</li>
  <li> 2. Route for restaurant personnel</li> 
  <li> 3. Route for administrative personnel</li>
</ol>

<ol class="px-4" >

  <p  class="leading-7 my-4" >The following features were developed by me:</p>

  <li > 1. General</li>

  <ul class="px-4" >
    <li> - General layout</li>
  </ul>

  <li class="leading-7 my-4"> 2. Administrative module </li>

  <ul class="px-4" >
    <li> - Users </li> 
    <li> - Roles </li>
    <li> - User payments </li>
    <li> - Divisions </li>
    <li> - Permission requests </li>
    <li> - Stores </li>
    <li> - Management of dynamic forms, this section is explained below due to its complexity </li>
  </ul>

  <h3 class="leading-5 my-6 font-bold"> Forms:</h3>

  <p class="leading-7 my-4">The form module is fully dynamic, allowing administrative staff to create them dynamically and with a graphical interface. It allows the creation of form fields such as text, numeric, images, email, file; among many others, with their validations and even with many functionalities that the inputs allow. This module was created to conduct surveys to clients, for example. It is the only public route and users can fill out the information when the administrative staff shares the link to that form. This module was heavily inspired by https://www.jotform.com/, obviously, the scope of this application is much broader. All functionality is done in pure TypeScript without any library or framework.
  </p>

  <li> 3. Restaurant module </li>

  <ul class="px-4" > 
    <li> - Supplier management </li>
    <li> - Creation of inventories for restaurants </li> 
    <li> - Inventory approval workflow </li>
    <li> - Creation of purchase orders </li>
  </ul>
</ol>
