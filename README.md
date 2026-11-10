# Chocolates La Frontera · App móvil

Interfaz móvil (React + Vite + Capacitor) de la tienda de chocolate artesanal de San Luis Potosí.

**No tiene base de datos ni lógica de negocio propia.** Usa la misma API que la web: `https://chocolates-la-frontiere.valebarbosa960.workers.dev/api` (Cloudflare Worker + D1). Los precios, promociones, pedidos y cobros con PayPal se calculan en el servidor, igual que en la página.

## Pantallas

| Pestaña | Qué hace | Endpoints |
|---|---|---|
| Inicio | Hero, promociones, categorías, más vendidos | `GET /catalog` |
| Catálogo | Filtro por categoría y ficha de producto | `GET /catalog` |
| Carrito | Cantidades, código de promoción, código postal, resumen y pago con PayPal | `POST /orders/quote`, `POST /orders`, `POST /orders/:id/capture`, `GET /paypal/config` |
| Cuenta | Iniciar sesión, crear cuenta, mis pedidos | `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`, `GET /auth/me`, `GET /orders` |
| Más | Nuestra historia, recetario y contacto (formulario) | `POST /contact` |

## Cómo correrla

```bash
npm install
npm run dev                 # navegador en http://localhost:5173
```

Para apuntar a otro backend (por ejemplo, tu Worker local con `npm run dev` de la web):

```bash
VITE_SITE_URL=http://localhost:5173 npm run dev
```

## Android

La carpeta `android/` se genera en tu PC (no se sube a git):

```bash
npm install
npx cap add android         # solo la primera vez
npm run cap:sync            # compila la interfaz y la copia al proyecto Android
npm run cap:open            # abre Android Studio
```

## Pendiente antes de que el inicio de sesión y los pagos funcionen en el celular

La app corre dentro del teléfono (origen `https://localhost` en Android), y la API está en otro dominio (`workers.dev`). Hoy el Worker guarda la sesión en una cookie con `SameSite=Lax` (`worker/auth.js`) y **no envía encabezados CORS**, así que el teléfono no puede iniciar sesión ni pagar. Para arreglarlo en el repo de la web:

1. Responder con `Access-Control-Allow-Origin` igual al origen de la app (`https://localhost` y `capacitor://localhost`), `Access-Control-Allow-Credentials: true` y `Access-Control-Allow-Headers: Content-Type`, y atender las peticiones `OPTIONS`.
2. Emitir la cookie de sesión con `SameSite=None; Secure` para que viaje entre dominios.

Mientras eso no esté, el catálogo, la historia, el recetario y el formulario de contacto sí funcionan.
