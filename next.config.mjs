/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    outputFileTracingIncludes: {
      '/': ['./node_modules/@google-cloud/tasks/build/esm/src/**/*.json'],
    },
  }
};

export default nextConfig;
