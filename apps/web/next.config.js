/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Отключаем serverComponentsExternalPackages для Supabase
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  
  // Настройки для устранения warnings
  typescript: {
    // Предупреждения TypeScript в development, но не блокируют build
    ignoreBuildErrors: false,
  },

  eslint: {
    // Предупреждения ESLint в development, но не блокируют build
    ignoreDuringBuilds: false,
  },

  // Настройки производительности
  poweredByHeader: false,
  
  // Оптимизация изображений
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },

  // Настройки Webpack для оптимизации
  webpack: (config, { dev, isServer }) => {
    // В development добавляем больше информации для отладки
    if (dev) {
      config.devtool = 'cheap-module-source-map'
    }
    
    return config
  },

  // Настройки для устранения предупреждений
  onDemandEntries: {
    // Увеличиваем время кэширования для dev
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // Настройки компиляции
  swcMinify: true,
  
  // Настройки статических файлов
  trailingSlash: false,
  
  // Редиректы и переписывание URL
  async redirects() {
    return []
  },

  async rewrites() {
    return []
  },

  // Заголовки безопасности
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 