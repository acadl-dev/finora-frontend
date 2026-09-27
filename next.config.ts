import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  // Gera um servidor Node mínimo em .next/standalone (imagem Docker enxuta para produção)
  output: "standalone",
};

export default nextConfig;
