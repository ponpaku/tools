/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  async redirects() {
    return [
      // 恒久リダイレクト設定
      {
        source: '/url-encoder',
        destination: '/tools/url-encoder',
        permanent: true,
      },
      {
        source: '/buddhist-memorial',
        destination: '/tools/memorial-calculator',
        permanent: true,
      },
      {
        source: '/microwave-converter',
        destination: '/tools/microwave-calculator',
        permanent: true,
      },
      {
        source: '/case-converter',
        destination: '/tools/case-converter',
        permanent: true,
      },
      {
        source: '/amazon-shortener',
        destination: '/tools/amazon-link',
        permanent: true,
      },
      {
        source: '/bingo',
        destination: '/tools/bingo-roulette',
        permanent: true,
      },
      {
        source: '/age-calculator',
        destination: '/tools/age-calculator',
        permanent: true,
      },
      {
        source: '/roulette',
        destination: '/tools/roulette',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig