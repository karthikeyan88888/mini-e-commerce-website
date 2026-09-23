# NEXORO — Precision-Engineered E-Commerce Platform

> **Sound, Re-Engineered.**  
> A premium audiophile hardware commerce platform pairing a signature 300-frame scroll-driven canvas exploded-view hero with a full-stack transactional e-commerce engine, real-time inventory management, and 5-stage shipment telemetry.

---

## 🌟 Key Highlights & Visual Experience

- **Signature Canvas Hero Sequence:** 300 sequential exploded-view frames rendered via HTML5 Canvas with double buffering, requestAnimationFrame interpolation, and a 6-phase engineering narrative.
- **Interactive 3D Product Viewer:** Dedicated WebGL inspection studio built with React Three Fiber, Three.js, and `@react-three/drei` displaying authentic binary GLB models with PBR materials, orbit controls, auto-rotation, and full-screen inspection.
- **27-Product Acoustic Ecosystem:** Comprehensive catalog across 5 specialized audio divisions: Flagship Headphones, Balanced Armature IEMs, High-End Amplification & DACs, Monocrystalline Cables & Hardware, and Acoustic Treatment Matrices.
- **Concierge & Customer Care (`/support`):** Real-time ticket dispatch engine, instant order tracking lookup widget, direct global engineering channels, 3-Year Studio Warranty, and 5-item interactive technical FAQ accordion.
- **Obsidian & Copper Design System:** Tailored luxury technology palette (`#070707` Obsidian, `#111214` Graphite, `#C8834A` Copper Accent, `#F5F1EA` Warm Ivory) with Plus Jakarta Sans & Inter typography.
- **End-to-End Customer Lifecycle:** Live search, multi-category filters, real-time cart drawer, atomic stock-validated checkout, order confirmation, and an interactive 5-stage telemetry timeline (`PLACED` &rarr; `CONFIRMED` &rarr; `PACKED` &rarr; `SHIPPED` &rarr; `DELIVERED`).
- **Merchant Operations Suite:** Recharts analytics, low-stock threshold alerts, full product CRUD with safe historical deactivation, inline inventory modifier, and order status workflow manager.
- **Complete SRS Documentation:** Full Software Requirements Specification available in [`docs/SRS.md`](./docs/SRS.md).

---

## 🚀 Quick Start (One Command Run)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 2. Installation & Database Setup
```bash
# 1. Install root, backend, and frontend dependencies
npm run install:all

# 2. Synchronize database schema and seed realistic demo catalog
npm run db:push
npm run db:seed
```

### 3. Running Frontend & Backend
You can launch both services concurrently:

```bash
# Terminal 1: Launch Backend Server (Port 5000)
npm run dev:server

# Terminal 2: Launch Frontend Client (Port 3000)
npm run dev:client
```

Open your browser at **`http://localhost:3000`** to experience NEXORO.

---

## 🔐 Demo Credentials (Instant Access)

The application includes built-in quick-fill buttons on the login page for effortless evaluation:

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **👑 Admin (Merchant)** | `admin@nexoro.io` | `Admin@123` | Full Operations Dashboard, Analytics, Product CRUD, Inventory Monitor, Order Status Progression |
| **👤 Customer (Buyer)** | `customer@nexoro.io` | `Customer@123` | Hardware Catalog, Cart Management, Checkout, My Orders, Real-time Order Tracking |

---

## 🏗️ Architecture & Technology Stack

```
Browser (Client)
    ↓
React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons
    ↓
TanStack Query & React Router
    ↓
REST API (JSON over HTTP)
    ↓
Fastify (Node.js + TypeScript) + @fastify/jwt + bcryptjs
    ↓
Prisma ORM (Modular Services & Atomic Transactions)
    ↓
SQLite / PostgreSQL Database
```

### Stack Breakdown
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, TanStack React Query, React Router 6, Recharts, Lucide React.
- **Backend:** Node.js, Fastify, TypeScript, Prisma ORM, Zod, @fastify/jwt, @fastify/cors, bcryptjs.
- **Database:** SQLite (`dev.db` for instant zero-dependency execution) with direct PostgreSQL provider compatibility.
- **Hero Engine:** HTML5 Canvas image-sequence streaming with progressive asset buffering.

---

## 📁 Repository Structure

```
fullstack project/
├── client/                     # Frontend Application
│   ├── public/
│   │   └── hero/frames/        # 300 sequential exploded-view frames (ezgif-frame-001 to 300)
│   ├── src/
│   │   ├── api/                # Axios client & JWT interceptors
│   │   ├── components/         # HeroCanvas, Navbar, Footer, ProductCard, CartDrawer, OrderTimeline, StatusBadge
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── layouts/            # MainLayout, AdminLayout
│   │   ├── pages/              # Home, Catalog, ProductDetail, Cart, Checkout, OrderConfirmation, Orders, Tracking, Auth
│   │   │   └── admin/          # AdminDashboard, AdminProducts, AdminInventory, AdminOrders
│   │   ├── types/              # Domain interfaces
│   │   ├── App.tsx             # Route configuration
│   │   └── index.css           # Custom design tokens & scrollbars
│   ├── tailwind.config.js      # NEXORO Obsidian & Copper theme
│   └── vite.config.ts          # Proxy configuration to backend
├── server/                     # Backend Fastify API
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (User, Product, Cart, Order, OrderItem)
│   │   └── seed.ts             # Realistic catalog & demo user seeding
│   ├── src/
│   │   ├── modules/            # Auth, Products, Cart, Orders, Inventory, Admin
│   │   ├── middleware/         # JWT authentication & Admin role guards
│   │   ├── config.ts           # Environment configuration
│   │   ├── prisma.ts           # Prisma client singleton
│   │   └── server.ts           # Fastify server bootstrap
│   └── package.json
├── docs/
│   └── SRS.md                  # Complete Software Requirements Specification
├── README.md                   # Project documentation
└── .env.example
```

---

## 🛒 Core Features Walkthrough

### 1. Customer Shopping Lifecycle
1. **Explore & Filter:** Search across models or filter by category (Headphones, Amplification, Accessories, Acoustics) and stock status.
2. **Product Deep-Dive:** Inspect technical specifications (beryllium drivers, impedance, THD+N, frequency response).
3. **Cart Management:** Live quantity adjustment with real-time subtotal, 8% tax calculation, and free shipping over $150.
4. **Checkout:** Atomic validation verifies stock before placing orders. Order items freeze `priceAtPurchase`.
5. **Confirmation & Telemetry:** Instant Order ID generation with an interactive 5-stage visual tracker.

### 2. Admin Operations Suite
1. **Executive Dashboard:** Live metrics for revenue, total orders, active SKUs, and pending fulfillments with Recharts analytics.
2. **Product Catalog CRUD:** Add new hardware systems with SKU validation or edit existing models.
3. **Safe Deactivation:** Deleting an ordered product marks it `INACTIVE` so historical receipts remain 100% accurate.
4. **Live Inventory Monitor:** Real-time stock counts with inline one-click stock updates.
5. **Order Lifecycle Control:** Advance orders from `PLACED` &rarr; `CONFIRMED` &rarr; `PACKED` &rarr; `SHIPPED` &rarr; `DELIVERED`, instantly updating customer tracking telemetry.

---

## 📡 API Reference Overview

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/auth/register` | `POST` | Public | Create customer or admin account |
| `/api/auth/login` | `POST` | Public | Authenticate and issue JWT token |
| `/api/auth/me` | `GET` | User | Get current profile and cart count |
| `/api/products` | `GET` | Public | List products with search, category, sort, stock |
| `/api/products/:id` | `GET` | Public | Get product details & related items |
| `/api/products` | `POST` | Admin | Create new catalog product |
| `/api/products/:id` | `PUT` | Admin | Update product metadata |
| `/api/products/:id` | `DELETE`| Admin | Safe delete or deactivate product |
| `/api/cart` | `GET` | User | Get active user cart and calculations |
| `/api/cart/items` | `POST` | User | Add item with stock limit validation |
| `/api/cart/items/:id` | `PUT` | User | Modify item quantity in cart |
| `/api/cart/items/:id` | `DELETE`| User | Remove item from cart |
| `/api/orders` | `POST` | User | Atomic checkout and inventory decrementation |
| `/api/orders` | `GET` | User | List user's historical orders |
| `/api/orders/:id` | `GET` | User/Admin | Detailed order tracking telemetry |
| `/api/admin/dashboard` | `GET` | Admin | Aggregate KPI metrics & charts data |
| `/api/admin/orders` | `GET` | Admin | List all merchant customer orders |
| `/api/admin/orders/:id/status`| `PUT`| Admin | Progress order lifecycle status |
| `/api/inventory` | `GET` | Admin | Inventory stock monitoring |
| `/api/inventory/:id/stock` | `PATCH` | Admin | Inline stock allocation update |

---

## 🧪 Verification & Testing

### Automated Build Validation
```bash
# Check Backend TypeScript compilation
cd server && npx tsc --noEmit

# Check Frontend Vite & TypeScript build
cd client && npm run build
```

### Full E2E Verification Workflow
1. Navigate to `http://localhost:3000`.
2. Scroll through the homepage to experience the 300-frame exploded-view canvas hero.
3. Click **"Shop the Collection"** and select **NEXORO Apex Pro Wireless**.
4. Add to cart, open cart drawer, adjust quantities, and click **"Proceed to Checkout"**.
5. Confirm order with pre-filled shipping details.
6. Click **"Track Order Real-Time"** to view the interactive 5-stage timeline.
7. Open the user menu, sign out, and sign in as **Admin** (`admin@nexoro.io`).
8. Navigate to **"Admin Panel &rarr; Orders"**, locate the customer order, and advance its status to `SHIPPED`.
9. Switch back or inspect customer tracking to observe instant synchronization.

---

## 📄 License & Team

Developed for the college hackathon by the **NEXORO Engineering Team**.  
All original product concepts, branding, and acoustic specifications are licensed under the MIT License.
