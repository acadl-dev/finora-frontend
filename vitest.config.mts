import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Testes unitários do front-end (validações, clientes de API e rotas /api).
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: { reporter: ["text", "html"], include: ["src/lib/**", "src/app/api/**"] },
  },
});
