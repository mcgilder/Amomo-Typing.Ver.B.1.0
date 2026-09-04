import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { edgeTtsPlugin } from './edge-tts-plugin';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5173,
        host: '0.0.0.0',
        // 智谱 GLM（国内直连）反向代理：绕过浏览器 CORS 限制
        proxy: {
          '/zhipu-api': {
            target: 'https://open.bigmodel.cn',
            changeOrigin: true,
            rewrite: (p) => p.replace(/^\/zhipu-api/, '/api/paas/v4'),
            secure: true
          }
        }
      },
      plugins: [
        react(),
        // Edge 神经音色本地服务：/api/tts（免费无密钥，粤语/普通话/英语高音质）
        edgeTtsPlugin()
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.ZHIPU_API_KEY': JSON.stringify(env.ZHIPU_API_KEY || env.VITE_ZHIPU_API_KEY || '')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
