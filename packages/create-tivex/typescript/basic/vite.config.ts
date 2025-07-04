import { defineConfig } from 'vite';
import { tivexTransform } from 'vite-transform-tivex';

export default defineConfig({
  plugins: [tivexTransform()],
});
