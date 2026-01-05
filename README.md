# FitDesk FrontEnd

# 1.- Levantar el backend

## Levantar backend con docker compose

```bash
docker-compose up -d --build
```

## Apagar todo los contenedores

```bash
docker compose down
```

# 2. Instalar dependencias

```bash
bun install
```
# 3. Crear el archivo .env en la raiz del proyecto

```bash
VITE_API_URL=http://localhost:9090
VITE_MERCADOPAGO_PUBLIC_KEY=TU_CLAVE_PUBLICA_DE_MERCADOPAGO
```     

# 4.Levantar el frontend y backend

```bash
bun run dev
backend -> http://localhost:9090
frontend -> http://localhost:5173
```


# Arquitectura 
```
├── 📁 assets
├── 📁 core
│   ├── 📁 api
│   │   └── 📄 fitdeskApi.ts
│   ├── 📁 context
│   │   └── 📄 get-strict-context.tsx
│   ├── 📁 hooks
│   │   ├── 📄 useAuth.ts
│   │   ├── 📄 useChat.ts
│   │   └── 📄 useDebounce.ts
│   ├── 📁 interfaces
│   │   ├── 📄 admin-user.interface.ts
│   ├── 📁 lib
│   │   ├── 📄 currency-formatter.ts
│   │   └── 📄 utils.ts
│   ├── 📁 middlewares
│   │   └── 📄 logger.middleware.ts
│   ├── 📁 providers
│   │   ├── 📄 auth-provider.tsx
│   │   └── 📄 theme-provider.tsx
│   ├── 📁 queries
│   │   ├── 📄 useAdminUserQuery.ts
│   │   ├── 📄 useAuthQuery.ts
│   │   ├── 📄 useBillingQuery.ts
│   │   └── 📄 useMemberQuery.ts
│   ├── 📁 routes
│   │   └── 📄 usePrefetchRoutes.ts
│   ├── 📁 services
│   │   ├── 📄 admin-user.service.ts
│   │   ├── 📄 auth.service.ts
│   ├── 📁 store
│   │   ├── 📄 auth.store.ts
│   │   ├── 📄 chat.store.ts
│   │   └── 📄 payment.store.ts
│   ├── 📁 utils
│   │   ├── 📄 auth-helpers.ts
│   │   ├── 📄 card-utils.ts
│   │   ├── 📄 chat-helpers.ts
│   │   ├── 📄 cropImage.ts
│   │   ├── 📄 generate-uuid.ts
│   │   └── 📄 sounds.ts
│   └── 📁 zod
│       ├── 📁 admin
│       │   └── 📄 profile.schemas.ts
│       └── 📄 trainer-configuration.schemas.ts
├── 📁 lib
│   └── 📄 utils.ts
├── 📁 modules
│   ├── 📁 admin
│   │   ├── 📁 analytics
│   │   ├── 📁 billing
│   │   ├── 📁 classes
│   │   ├── 📁 components
│   │   │   └── 📁 ui
│   │   ├── 📁 dashboard
│   │   ├── 📁 members
│   │   ├── 📁 plans
│   │   ├── 📁 profile
│   │   ├── 📁 roles
│   │   └── 📁 trainers
│   ├── 📁 client
│   │   ├── 📁 blog

│   │   ├── 📁 classes
│   │   ├── 📁 components
│   │   │   └── 📁 ui
│   │   ├── 📁 dashboard
│   │   ├── 📁 messages
│   │   ├── 📁 notifications
│   │   ├── 📁 payments
│   │   ├── 📁 profile
│   │   ├── 📁 reserva-clase
│   │   └── 📁 sesiones-personalizadas
│   ├── 📁 shared
│   │   ├── 📁 auth
│   │   ├── 📁 chat
│   │   └── 📁 landing
│   └── 📁 trainer
│       ├── 📁 attendance
│       ├── 📁 calendar
│       ├── 📁 configuration
│       ├── 📁 dashboard
│       ├── 📁 messages
│       ├── 📁 profile
│       └── 📁 students
├── 📁 shared
│   ├── 📁 components
│   │   ├── 📁 animated
│   │   │   ├── 📁 effects
│   │   │   │   ├── 📄 motion-effect.tsx
│   │   │   │   ├── 📄 motion-highlight.tsx
│   │   │   │   └── 📄 theme-toggler.tsx
│   │   ├── 📁 icons
│   │   ├── 📁 ui
│   └── 📁 layouts
├── ⚙️ .editorconfig
├── 📄 App.tsx
├── 📄 app.router.tsx
├── 🎨 index.css
├── 📄 main.tsx
```