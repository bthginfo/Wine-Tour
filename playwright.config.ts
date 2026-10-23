import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests',timeout:90000,expect:{timeout:15000},workers:1,use:{baseURL:process.env.TEST_BASE_URL||'http://localhost:5173',headless:true,screenshot:'only-on-failure'},reporter:'list'});
