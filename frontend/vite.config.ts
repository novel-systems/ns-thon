import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [
        {
            name: 'treat-js-files-as-jsx',
            async transform(code, id) {
                if (!id.match(/src\/.*\.js$/)) return null

                // Use the exposed transform from vite, instead of directly
                // transforming with esbuild
                return transformWithEsbuild(code, id, {
                    loader: 'jsx',
                    jsx: 'automatic',
                })
            },
        },
        tsconfigPaths(),
        react(),
    ],
    server: {
        port: 3000,
        proxy: {
            '/api': 'http://localhost:2222',
            '/graphql': 'http://localhost:2222',
        },
    },
    optimizeDeps: {
        force: true,
        include: ['@novel-systems/shared'],
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
        },
    },
    build: {
        commonjsOptions: {
            include: [/node_modules/, /shared/],
        },
    },
})
