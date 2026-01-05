import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            '@core': path.resolve(__dirname, 'src/core'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom'],
                    lucide: ['lucide-react'],
                    motion: ['motion/react'],
                    radix: [
                        '@radix-ui/react-checkbox',
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-label',
                        '@radix-ui/react-radio-group',
                        '@radix-ui/react-scroll-area',
                        '@radix-ui/react-select',
                        '@radix-ui/react-separator',
                        '@radix-ui/react-slider',
                        '@radix-ui/react-slot',
                        '@radix-ui/react-switch',
                        '@radix-ui/react-tabs',
                        '@radix-ui/react-tooltip'
                    ],
                    tanstack: [
                        '@tanstack/react-query',
                        '@tanstack/react-query-devtools',
                        '@tanstack/react-table'
                    ],
                    recharts: ['recharts'],
                    zod: ['zod'],
                    dateFns: ['date-fns'],
                }
            }
        }
    }
})