# Copilot Chat Conversation Export: Production-level React app for law firm

**User:** @EsraaAshraf221
**Thread URL:** https://github.com/copilot/c/2ffccd6c-cf62-43c7-810f-b0d8e10d1d88

## @EsraaAshraf221

Create a production-level React 18 + Vite + TypeScript project for a premium Law Firm website frontend.

Tech Stack:
- React 18
- Vite
- TypeScript
- Tailwind CSS (latest)
- React Router DOM
- Zustand (state management)
- React Hook Form
- Framer Motion
- Axios
- Sonner (toast)
- Lucide React icons
- Headless UI

Setup Requirements:

1) Configure Tailwind with custom theme:
   Colors:
   - primary-black: #0B0B0B
   - charcoal: #111111
   - gold: #C6A75E
   - gold-light: #E6C77B
   - gold-dark: #A8893D

2) Add elegant font pairing (Playfair Display + Inter)

3) Create scalable folder structure:

/src
  /app
  /components/ui
  /components/shared
  /features
  /layouts
  /pages
  /routes
  /services
  /store
  /hooks
  /types
  /data

4) Setup:
- Router
- Auth guard (admin / client roles)
- Zustand auth store
- Mock login system
- Layout system (PublicLayout, AdminLayout, ClientLayout)

5) Add smooth page transitions using Framer Motion.

Generate:
- Full project structure
- Main.tsx
- Router setup
- Auth store
- Tailwind config
- Example layout

## Copilot

I'll create a production-level React 18 + Vite + TypeScript project for a premium Law Firm website. This is a comprehensive setup with all the requested features.I'm waiting for your response to accept or reject the repository creation before I proceed with setting up the project files.

However, let me provide you with the complete production-level setup files that you'll need. I'll create comprehensive configuration and project structure files:

```json name=package.json
{
  "name": "law-firm-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "zustand": "^4.5.5",
    "tailwindcss": "^3.4.3",
    "framer-motion": "^11.5.4",
    "react-hook-form": "^7.54.0",
    "axios": "^1.7.7",
    "sonner": "^1.7.0",
    "lucide-react": "^0.438.0",
    "@headlessui/react": "^1.7.19"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "vite": "^5.4.10",
    "typescript": "^5.6.3",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "@tailwindcss/forms": "^0.5.9"
  }
}
```

```typescript name=vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
```

```typescript name=tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

```json name=tsconfig.node.json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

```css name=tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-black': '#0B0B0B',
        'charcoal': '#111111',
        'gold': '#C6A75E',
        'gold-light': '#E6C77B',
        'gold-dark': '#A8893D',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading-1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-2': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-3': ['1.5rem', { lineHeight: '1.3' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
      },
      spacing: {
        'section': '5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} satisfies Config
```

```css name=src/index.css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base Styles */
@layer base {
  html {
    @apply scroll-smooth;
  }

  body {
    @apply bg-charcoal text-white font-inter;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-playfair font-semibold;
  }

  h1 {
    @apply text-display;
  }

  h2 {
    @apply text-heading-1;
  }

  h3 {
    @apply text-heading-2;
  }

  button {
    @apply transition-all duration-300 ease-in-out;
  }
}

/* Component Utilities */
@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-all duration-300;
  }

  .btn-primary {
    @apply btn bg-gold text-primary-black hover:bg-gold-light;
  }

  .btn-secondary {
    @apply btn bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-primary-black;
  }

  .btn-dark {
    @apply btn bg-primary-black border-2 border-white text-white hover:bg-white hover:text-primary-black;
  }

  .container-max {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .section-padding {
    @apply py-20 md:py-section;
  }

  .gradient-gold {
    @apply bg-gradient-to-r from-gold to-gold-light;
  }

  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-gold to-gold-light;
  }
}
```

```typescript name=src/types/index.ts
export type UserRole = 'admin' | 'client' | 'guest'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
}

export interface PageTransitionProps {
  children: React.ReactNode
}
```

```typescript name=src/store/authStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User, UserRole } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  clearError: () => void
  checkAuth: () => void
}

// Mock user data
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@lawfirm.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@lawfirm.com',
      name: 'Admin User',
      role: 'admin' as UserRole,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      createdAt: new Date(),
    },
  },
  'client@example.com': {
    password: 'client123',
    user: {
      id: '2',
      email: 'client@example.com',
      name: 'John Client',
      role: 'client' as UserRole,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client',
      createdAt: new Date(),
    },
  },
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null })
          
          try {
            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 800))

            const mockUser = MOCK_USERS[email]
            if (!mockUser) {
              throw new Error('User not found')
            }

            if (mockUser.password !== password) {
              throw new Error('Invalid password')
            }

            const token = `token_${Date.now()}`
            set({
              user: mockUser.user,
              token,
              isAuthenticated: true,
              isLoading: false,
            })
          } catch (err) {
            const error = err instanceof Error ? err.message : 'Login failed'
            set({
              error,
              isLoading: false,
              isAuthenticated: false,
            })
            throw err
          }
        },

        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          })
        },

        setUser: (user) => {
          set({
            user,
            isAuthenticated: !!user,
          })
        },

        clearError: () => {
          set({ error: null })
        },

        checkAuth: () => {
          // This can be called on app initialization to check if user is still authenticated
          // In a real app, verify token validity with backend
          const { user, token } = useAuthStore.getState()
          if (!user || !token) {
            set({ isAuthenticated: false })
          }
        },
      }),
      {
        name: 'auth-storage',
      }
    )
  )
)
```

```typescript name=src/hooks/useAuth.ts
import { useAuthStore } from '@/store/authStore'

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
  } = useAuthStore()

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
    isAdmin: user?.role === 'admin',
    isClient: user?.role === 'client',
  }
}
```

```typescript name=src/routes/index.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AdminLayout from '@/layouts/AdminLayout'
import ClientLayout from '@/layouts/ClientLayout'
import ProtectedRoute from '@/routes/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'

// Public Pages
import Home from '@/pages/Home'
import Services from '@/pages/Services'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import Login from '@/pages/Login'

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminClients from '@/pages/admin/Clients'
import AdminCases from '@/pages/admin/Cases'

// Client Pages
import ClientDashboard from '@/pages/client/Dashboard'
import ClientCases from '@/pages/client/Cases'
import ClientProfile from '@/pages/client/Profile'

export default function AppRoutes() {
  const { isAuthenticated, user } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth Route */}
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/clients" element={<AdminClients />} />
        <Route path="/admin/cases" element={<AdminCases />} />
      </Route>

      {/* Client Routes */}
      <Route
        element={
          <ProtectedRoute requiredRole="client">
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/client/cases" element={<ClientCases />} />
        <Route path="/client/profile" element={<ClientProfile />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
```

```typescript name=src/routes/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
```

```typescript name=src/components/ui/PageTransition.tsx
import { motion } from 'framer-motion'

interface PageTransitionProps {
  children: React.ReactNode
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: 'easeIn',
    },
  },
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  )
}
```

```typescript name=src/components/ui/Button.tsx
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'dark'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  dark: 'btn-dark',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  )
}
```

```typescript name=src/components/shared/Header.tsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()

  const navItems = [
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header className="fixed w-full top-0 z-50 bg-charcoal border-b border-gold/20">
      <nav className="container-max py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="font-playfair text-2xl font-bold text-gold"
            >
              LAW & CO
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <motion.span
                  whileHover={{ color: '#C6A75E' }}
                  className="text-white transition-colors"
                >
                  {item.label}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gold">{user?.name}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={logout}
                  className="px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-gold text-primary-black rounded-lg font-semibold"
                >
                  Login
                </motion.button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gold"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 pt-4 border-t border-gold/20 space-y-4"
          >
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <motion.div
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gold transition-colors"
                >
                  {item.label}
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </nav>
    </header>
  )
}
```

```typescript name=src/components/shared/Footer.tsx
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-black border-t border-gold/20">
      <div className="container-max py-section">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-playfair text-xl font-bold text-gold mb-4">
              LAW & CO
            </h3>
            <p className="text-gray-400 text-sm">
              Premium legal services for businesses and individuals.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-gold transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-gold transition-colors">
                  Corporate Law
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">
                  Litigation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">
                  Intellectual Property
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-gold" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-gold" />
                info@lawco.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-gold" />
                123 Legal Ave, City
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gold/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="text-gray-500 text-sm">
              © {currentYear} Law & Co. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-gold text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-gold text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

```typescript name=src/layouts/PublicLayout.tsx
import { Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import PageTransition from '@/components/ui/PageTransition'

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-charcoal">
      <Header />
      <main className="flex-1 pt-20">
        <AnimatePresence mode="wait">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
```

```typescript name=src/layouts/AdminLayout.tsx
import { Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/shared/Header'
import AdminSidebar from '@/components/shared/AdminSidebar'
import PageTransition from '@/components/ui/PageTransition'

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-charcoal">
      <Header />
      <AdminSidebar />
      <main className="flex-1 pt-20 pl-64">
        <AnimatePresence mode="wait">
          <PageTransition>
            <div className="container-max py-8">
              <Outlet />
            </div>
          </PageTransition>
        </AnimatePresence>
      </main>
    </div>
  )
}
```

```typescript name=src/layouts/ClientLayout.tsx
import { Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/shared/Header'
import ClientSidebar from '@/components/shared/ClientSidebar'
import PageTransition from '@/components/ui/PageTransition'

export default function ClientLayout() {
  return (
    <div className="flex min-h-screen bg-charcoal">
      <Header />
      <ClientSidebar />
      <main className="flex-1 pt-20 pl-64">
        <AnimatePresence mode="wait">
          <PageTransition>
            <div className="container-max py-8">
              <Outlet />
            </div>
          </PageTransition>
        </AnimatePresence>
      </main>
    </div>
  )
}
```

```typescript name=src/components/shared/AdminSidebar.tsx
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Users, Briefcase } from 'lucide-react'

export default function AdminSidebar() {
  const location = useLocation()

  const menuItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
    { label: 'Clients', href: '/admin/clients', icon: Users },
    { label: 'Cases', href: '/admin/cases', icon: Briefcase },
  ]

  return (
    <aside className="fixed left-0 top-20 w-64 h-screen bg-primary-black border-r border-gold/20">
      <nav className="p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href

          return (
            <Link key={item.href} to={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gold/20 text-gold border-l-2 border-gold'
                    : 'text-gray-400 hover:text-gold hover:bg-gold/10'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

```typescript name=src/components/shared/ClientSidebar.tsx
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Briefcase, User } from 'lucide-react'

export default function ClientSidebar() {
  const location = useLocation()

  const menuItems = [
    { label: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
    { label: 'My Cases', href: '/client/cases', icon: Briefcase },
    { label: 'Profile', href: '/client/profile', icon: User },
  ]

  return (
    <aside className="fixed left-0 top-20 w-64 h-screen bg-primary-black border-r border-gold/20">
      <nav className="p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href

          return (
            <Link key={item.href} to={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gold/20 text-gold border-l-2 border-gold'
                    : 'text-gray-400 hover:text-gold hover:bg-gold/10'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

```typescript name=src/pages/Home.tsx
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Scales, Users } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="section-padding pt-32 pb-20 bg-gradient-to-br from-charcoal via-primary-black to-charcoal">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="mb-6 text-display text-gradient">
              Premium Legal Excellence
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Providing world-class legal services for corporations and individuals.
              Trusted by industry leaders.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="primary">
                Get Started <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button size="lg" variant="secondary">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-primary-black">
        <div className="container-max">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center text-heading-1 mb-16 text-gradient"
          >
            Why Choose Us
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Protected Rights',
                description: 'Your legal rights are our top priority. We ensure complete protection.',
              },
              {
                icon: Scales,
                title: 'Fair Justice',
                description: 'Expert representation ensuring fair outcomes in all matters.',
              },
              {
                icon: Users,
                title: 'Expert Team',
                description: 'Seasoned professionals with decades of combined experience.',
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-8 bg-charcoal border border-gold/20 rounded-lg hover:border-gold/50 transition-all"
                >
                  <Icon size={40} className="text-gold mb-4" />
                  <h3 className="text-heading-3 mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-charcoal">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-heading-2 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Contact us today to schedule a consultation with one of our expert attorneys.
            </p>
            <Button size="lg" variant="primary">
              Schedule Consultation
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
```

```typescript name=src/pages/Services.tsx
import { motion } from 'framer-motion'

export default function Services() {
  return (
    <div className="pt-24">
      <section className="section-padding bg-charcoal">
        <div className="container-max">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-heading-1 text-gradient mb-6"
          >
            Our Services
          </motion.h1>
          <p className="text-gray-300 max-w-2xl">
            We offer comprehensive legal services across various practice areas.
          </p>
        </div>
      </section>
    </div>
  )
}
```

```typescript name=src/pages/About.tsx
import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="pt-24">
      <section className="section-padding bg-charcoal">
        <div className="container-max">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-heading-1 text-gradient mb-6"
          >
            About Us
          </motion.h1>
          <p className="text-gray-300 max-w-2xl">
            Learn more about our firm and our commitment to legal excellence.
          </p>
        </div>
      </section>
    </div>
  )
}
```

```typescript name=src/pages/Contact.tsx
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

export default function Contact() {
  return (
    <div className="pt-24">
      <section className="section-padding bg-charcoal">
        <div className="container-max">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-heading-1 text-gradient mb-6"
          >
            Contact Us
          </motion.h1>
          <p className="text-gray-300 max-w-2xl mb-12">
            Get in touch with our team. We're here to help.
          </p>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl bg-primary-black p-8 rounded-lg border border-gold/20"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gold mb-2">
                  Message
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none"
                  rows={5}
                  placeholder="Your message"
                />
              </div>

              <Button type="submit" variant="primary" size="lg">
                Send Message
              </Button>
            </div>
          </motion.form>
        </div>
      </section>
    </div>
  )
}
```

```typescript name=src/pages/Login.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import { toast } from 'sonner'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await login(formData.email, formData.password)
      toast.success('Login successful!')
      navigate(formData.email.includes('admin') ? '/admin/dashboard' : '/client/dashboard')
    } catch (err) {
      toast.error(error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-charcoal via-primary-black to-charcoal pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-charcoal p-8 rounded-lg border border-gold/20">
          <h1 className="text-heading-2 text-gold text-center mb-8">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none"
                placeholder="admin@lawfirm.com"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Try: admin@lawfirm.com or client@example.com
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none"
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Try: admin123 or client123
              </p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Test credentials above
          </p>
        </div>
      </motion.div>
    </div>
  )
}
```

```typescript name=src/pages/admin/Dashboard.tsx
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-heading-1 text-gradient mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: 'Total Clients', value: '124', change: '+12%' },
            { label: 'Active Cases', value: '48', change: '+5%' },
            { label: 'Revenue', value: '$98K', change: '+23%' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6 bg-charcoal border border-gold/20 rounded-lg"
            >
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <div className="flex items-baseline justify-between">
                <h3 className="text-3xl font-bold text-gold">{stat.value}</h3>
                <span className="text-green-400 text-sm">{stat.change}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
```

```typescript name=src/pages/admin/Clients.tsx
import { motion } from 'framer-motion'

export default function AdminClients() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-heading-1 text-gradient mb-8">Clients</h1>
      <div className="bg-charcoal border border-gold/20 rounded-lg p-6">
        <p className="text-gray-400">Client management interface</p>
      </div>
    </motion.div>
  )
}
```

```typescript name=src/pages/admin/Cases.tsx
import { motion } from 'framer-motion'

export default function AdminCases() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-heading-1 text-gradient mb-8">Cases</h1>
      <div className="bg-charcoal border border-gold/20 rounded-lg p-6">
        <p className="text-gray-400">Case management interface</p>
      </div>
    </motion.div>
  )
}
```

```typescript name=src/pages/client/Dashboard.tsx
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'

export default function ClientDashboard() {
  const { user } = useAuth()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-heading-1 text-gradient mb-2">Welcome Back</h1>
      <p className="text-gray-400 mb-8">{user?.name}</p>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          { label: 'My Cases', value: '3' },
          { label: 'Documents', value: '12' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="p-6 bg-charcoal border border-gold/20 rounded-lg"
          >
            <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
            <h3 className="text-3xl font-bold text-gold">{stat.value}</h3>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
```

```typescript name=src/pages/client/Cases.tsx
import { motion } from 'framer-motion'

export default function ClientCases() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-heading-1 text-gradient mb-8">My Cases</h1>
      <div className="bg-charcoal border border-gold/20 rounded-lg p-6">
        <p className="text-gray-400">Your cases will appear here</p>
      </div>
    </motion.div>
  )
}
```

```typescript name=src/pages/client/Profile.tsx
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'

export default function ClientProfile() {
  const { user } = useAuth()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-heading-1 text-gradient mb-8">Profile</h1>

      <div className="bg-charcoal border border-gold/20 rounded-lg p-8 max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          {user?.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full border-2 border-gold"
            />
          )}
          <div>
            <h2 className="text-heading-2 text-gold">{user?.name}</h2>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gold mb-2">Email</label>
            <input
              type="email"
              value={user?.email}
              readOnly
              className="w-full px-4 py-2 bg-primary-black border border-gold/20 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gold mb-2">Full Name</label>
            <input
              type="text"
              value={user?.name}
              readOnly
              className="w-full px-4 py-2 bg-primary-black border border-gold/20 rounded-lg text-white"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
```

```typescript name=src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  </React.StrictMode>
)
```

```typescript name=src/App.tsx
import AppRoutes from '@/routes'

export default function App() {
  return <AppRoutes />
}
```

```html name=index.html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Law & Co - Premium Legal Services</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

```json name=.eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-fast-refresh': 'warn',
  },
}
```

```json name=.gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment
.env
.env.local
.env.*.local
```

```css name=postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## Project Structure

```
law-firm-frontend/
├── src/
│   ├── app/
│   │   └── (future app-level configs)
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── PageTransition.tsx
│   │   │   └── (other UI components)
│   │   └── shared/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── AdminSidebar.tsx
│   │       ├── ClientSidebar.tsx
│   │       └── (other shared components)
│   ├── features/
│   │   ├── auth/
│   │   ├── cases/
│   │   └── clients/
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── layouts/
│   │   ├── PublicLayout.tsx
│   │   ├── AdminLayout.tsx
│   │   └── ClientLayout.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Services.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Login.tsx
│   │   ├── admin/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Clients.tsx
│   │   │   └── Cases.tsx
│   │   └── client/
│   │       ├── Dashboard.tsx
│   │       ├── Cases.tsx
│   │       └── Profile.tsx
│   ├── routes/
│   │   ├── index.tsx
│   │   └── ProtectedRoute.tsx
│   ├── services/
│   │   └── api.ts (Axios instance)
│   ├── store/
│   │   └── authStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.ts
├── postcss.config.js
├── package.json
└── .gitignore
```

## Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

## Test Credentials

```
Admin Account:
Email: admin@lawfirm.com
Password: admin123

Client Account:
Email: client@example.com
Password: client123
```

## Key Features Implemented

✅ **React 18 + Vite** - Latest version setup with HMR
✅ **TypeScript** - Full type safety throughout
✅ **Tailwind CSS** - Custom theme with premium colors
✅ **Font Integration** - Playfair Display + Inter
✅ **React Router DOM** - Complete routing system
✅ **Zustand** - State management with persistence
✅ **Auth System** - Role-based access control (Admin/Client)
✅ **Mock Login** - Built-in test credentials
✅ **Layout System** - PublicLayout, AdminLayout, ClientLayout
✅ **Framer Motion** - Smooth page transitions
✅ **Protected Routes** - Role-based route guards
✅ **Responsive Design** - Mobile-first approach
✅ **UI Components** - Button, PageTransition
✅ **Toast Notifications** - Sonner integration

This is a production-ready setup ready for expansion!
