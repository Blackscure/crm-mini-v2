import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import VuetifyLoaderPlugin from 'vuetify-loader/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // VuetifyLoaderPlugin(),
  ],
});
