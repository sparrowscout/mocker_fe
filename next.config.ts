import type { NextConfig } from 'next';
import withTwin from './withTwin';

const nextConfig: NextConfig = withTwin({
  /* config options here */
  reactStrictMode: true,
});

export default nextConfig;
