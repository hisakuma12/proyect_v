# Cumpleaños romántico

Landing page premium e interactiva hecha con Vite, Vue 3 y CSS moderno para una sorpresa de cumpleaños del 8 de mayo.

## Ejecutar

```bash
npm install
npm run dev
```

La app queda disponible en `http://127.0.0.1:5173/`.

## Publicar en GitHub Pages

La app ya está preparada para publicarse como sitio estático de Vite en GitHub Pages.

1. Sube el proyecto a GitHub en la rama `main`.
2. En GitHub, entra a `Settings` > `Pages`.
3. En `Build and deployment`, selecciona `GitHub Actions`.
4. Haz push a `main`; el workflow `Deploy to GitHub Pages` compila la app y publica la carpeta `dist`.

La URL final tendrá normalmente este formato:

```text
https://TU_USUARIO.github.io/NOMBRE_DEL_REPO/
```

## Editar textos y fotos

El contenido principal está en:

```text
src/data/siteContent.js
```

Puedes reemplazar las fotos reales dentro de `public/fotos` y referenciarlas desde `src/data/siteContent.js` con `photoPath(...)`:

```js
image: photoPath('nosotros.jpg')
```

## Mensajes de invitados

La sección "Mensajes de quienes te quieren" guarda mensajes y fotos subidas temporalmente en `localStorage`.

Para conectar Firebase, Supabase o un backend propio, cambia las funciones de:

```text
src/services/guestMessageStorage.js
```
