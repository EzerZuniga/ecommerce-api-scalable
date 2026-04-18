# E-commerce API Scalable

API REST profesional para e-commerce con arquitectura modular, JWT, PostgreSQL (Prisma), Swagger, caché con Redis y pruebas con Jest.

## Stack

- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT + bcrypt
- Swagger (`/api/docs`)
- Redis (caché opcional para listados de productos)
- Winston + Morgan (logs)
- Jest + Supertest (tests)

## Arquitectura

```text
src/
├── config/
├── docs/
├── middlewares/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   └── payments/
├── routes/
├── utils/
├── app.js
└── server.js
```

## Requisitos

- Node.js 20+
- PostgreSQL 14+
- Redis 7+ (opcional)

## Variables de entorno

1. Copia el archivo:

```bash
cp .env.example .env
```

2. Ajusta valores según tu entorno local.

## Instalación y ejecución local

```bash
npm install
npx prisma migrate dev --name init
npx prisma generate
node prisma/seed.js
npm run dev
```

Servidor: `http://localhost:3000`

Swagger: `http://localhost:3000/api/docs`

## Endpoints principales

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Users
- `GET /api/users/me`

### Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

### Cart
- `GET /api/cart`
- `POST /api/cart/add`
- `DELETE /api/cart/remove/:id`

### Orders
- `POST /api/orders`
- `GET /api/orders`

### Payments
- `POST /api/payments/checkout`

## Reglas de negocio destacadas

- Validación de stock antes de crear orden.
- Descuento de stock dentro de transacción en base de datos.
- Prevención de condiciones de carrera al decrementar stock.
- Checkout simulado:
  - `cardNumber = 4111111111111111` => pago aprobado.
  - otro número => pago rechazado.

## Ejemplos rápidos

### Registro

`POST /api/auth/register`

```json
{
  "name": "Jose",
  "email": "jose@example.com",
  "password": "12345678"
}
```

### Login

`POST /api/auth/login`

```json
{
  "email": "jose@example.com",
  "password": "12345678"
}
```

### Crear orden desde carrito

`POST /api/orders` con `Authorization: Bearer <token>`

### Pago simulado

`POST /api/payments/checkout`

```json
{
  "orderId": "YOUR_ORDER_ID",
  "cardNumber": "4111111111111111"
}
```

Respuesta:

```json
{
  "message": "Pago exitoso",
  "orderId": "YOUR_ORDER_ID",
  "orderStatus": "paid"
}
```

## Scripts útiles

- `npm run dev` - modo desarrollo con nodemon
- `npm start` - modo producción
- `npm test` - ejecutar tests
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:seed`

## Estado inicial (seed)

El seed crea:
- Usuario admin: `admin@ecommerce.com` / `admin12345`
- Productos demo para pruebas

## Próximos upgrades recomendados

- Integrar pasarela real (Stripe/MercadoPago)
- Webhooks de pago
- Refresh tokens
- CI/CD con GitHub Actions
- Tests de integración con base de datos de testing
