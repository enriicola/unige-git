import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const nextConfig = {
  // reactStrictMode: false, // to avoid multiple components mount in dev mode, remove the comment
  output: 'standalone',
  pageExtensions: ['jsx', 'js'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakeimg.pl',
        port: '',
        pathname: '/**',
      },
    ],
  },
  compiler: {
    styledComponents: true,
  },
  turbopack: {
    resolveAlias: {
      '#components': path.join(dirname, 'assets/components'),
      '#img': path.join(dirname, 'assets/img'),
      '#js': path.join(dirname, 'assets/js'),
      '#modules': path.join(dirname, 'assets/modules'),
      '#css': path.join(dirname, 'assets/css'),
      '#config': path.join(dirname, 'config'),
    },
  },
};

export default nextConfig;
