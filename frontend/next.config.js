/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '.replit.dev',
    '.repl.co',
    '.janeway.replit.dev',
  ],
}

module.exports = nextConfig
