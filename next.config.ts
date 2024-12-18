import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  compiler: {
    //  TODO  really?
    // styledComponents: true,
  },

  async headers() {
    return [
      {
        source: '/api/v1',
        headers: [
          { key: 'Content-Type', value: 'application/json' }, // Or any other MIME type
        ],
      },
    ]
  },

};

export default nextConfig;
