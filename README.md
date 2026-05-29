# OrderFlow Frontend

Next.js 16 e-commerce frontend for the OrderFlow microservices platform.

## Tech Stack

- **Next.js 16** - App Router, Server Components, Turbopack
- **React 19** - latest features
- **TypeScript** - strict mode
- **Tailwind CSS v4** - utility-first styling
- **shadcn/ui** - accessible UI components
- **Motion** - animations
- **React Query** - server state management
- **Axios** - HTTP client

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Copy `.env.example` to `.env.local` and set the backend URLs:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_PRODUCT_API_URL=http://localhost:8081
NEXT_PUBLIC_ORDER_API_URL=http://localhost:8082
```

## Backend Services

This frontend requires the following services running:

| Service | Port | Description |
|---|---|---|
| product-service | 8081 | Products catalog, shopping cart (Redis) |
| order-service | 8082 | Orders, checkout |
| fulfillment-service | 8083 | Email notifications (internal) |

Start all services via Docker Compose in the backend repo:

```bash
docker compose up -d
```

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   └── (shop)/           # Route group - e-commerce pages
│       ├── products/     # Product catalog
│       ├── cart/         # Shopping cart
│       ├── checkout/     # Order placement
│       └── orders/       # Order tracking
├── components/           # React components
│   ├── ui/               # shadcn/ui primitives
│   ├── layout/           # Navbar, Footer
│   ├── products/         # Product cards, grid, filters
│   ├── cart/             # Cart drawer, items
│   ├── checkout/         # Checkout form
│   └── orders/           # Order status, tracking
├── lib/
│   ├── api/              # API clients (product, order)
│   └── session.ts        # Session ID management
├── hooks/                # Custom React hooks
└── types/                # TypeScript interfaces
```

## Deployment

Deployed on [Vercel](https://vercel.com). Set environment variables in the Vercel dashboard pointing to production backend URLs.
