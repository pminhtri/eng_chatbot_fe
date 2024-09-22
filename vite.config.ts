import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'), // Entry point of your library
      name: 'core-lib', // Name of your library
      fileName: (format) => `core-lib.${format}.js`, // Output file name
    },
    rollupOptions: {
      // Ensure to externalize dependencies that shouldn't be bundled into your library
      external: ['react', 'react-dom'],
      output: {
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});