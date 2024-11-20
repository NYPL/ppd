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
};

export default nextConfig;
