# Knect - Frontend Web (Angular)

Aplicación cliente para la plataforma **Knect: Directorio Digital y Vitrina Comercial de Manizales**. Desarrollada con **Angular (Standalone Components, Signals)**, diseño atómico responsivo, soporte bilingüe (Español / Inglés) y consumo de la API REST de Spring Boot.

---

## 🛠️ Requisitos Previos

1. **Node.js** versión `v20.x`, `v22.x` o `v24.x` instalado (`node -v`).
2. **NPM** instalado (`npm -v`).
3. *(Opcional)* Angular CLI instalado globalmente: `npm install -g @angular/cli`.

---

## 📥 Instalación de Dependencias

Abre una terminal en la carpeta del frontend y ejecuta:

```bash
npm install
```

---

## 🚀 Cómo Ejecutar en Modo Desarrollo

Para levantar el servidor de desarrollo local:

```bash
npm start
```
*(O alternativamente: `npx ng serve`)*

Una vez iniciado el servidor, abre tu navegador en:  
👉 **`http://localhost:4200`**

El servidor cuenta con recarga en caliente (**Hot Reload**): cualquier cambio que guardes en los archivos se reflejará automáticamente en la pantalla.

---

## 🌐 Conexión con el Backend

Por defecto, el frontend se comunica con el backend de Spring Boot en:  
`http://localhost:8080/api`

Asegúrate de tener el backend corriendo en el puerto `8080` antes de iniciar sesión o realizar peticiones a la API.

---

## 🎨 Características Implementadas

* **Diseño Atómico Moderno**:
  * **Átomos:** Botones (`app-button`), inputs, insignias de estado y badges de categoría.
  * **Moléculas:** Tarjetas de negocio (`app-business-card`), barras de búsqueda y filtros.
  * **Organismos:** Barra de navegación con selector de idioma (`app-navbar`), pie de página (`app-footer`), panel de administración (`app-super-admin`, `app-brand-admin`).
* **Branding e Identidad**:
  * Logo vectorial integrado [`public/logo-knect.svg`](public/logo-knect.svg) optimizado para alta resolución y pantallas móviles.
* **Internacionalización (i18n)**:
  * Soporte nativo para alternar entre **Español (ES)** e **Inglés (EN)** al instante.
* **Paneles de Control**:
  * **Super Administrador:** Monitoreo y gestión de comercios de Manizales, auditoría y métricas globales.
  * **Administrador de Local:** Gestión de perfil comercial, catálogo de productos/servicios, enlaces a WhatsApp y redes sociales.

---

## 📦 Compilación para Producción

Para compilar el proyecto optimizado para despliegue:

```bash
npm run build
```

Los artefactos listos para producción se generarán en la carpeta:  
`dist/knect_app_frontend/`
