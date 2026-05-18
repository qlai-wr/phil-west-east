/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/phil-west-east',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
