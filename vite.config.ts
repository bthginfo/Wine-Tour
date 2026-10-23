import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import adapter from '@sveltejs/adapter-vercel';
export default defineConfig({ plugins: [sveltekit({adapter:adapter({runtime:'nodejs24.x',regions:['fra1'],maxDuration:60})})], server: { host: '0.0.0.0' } });
