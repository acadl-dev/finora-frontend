# Finora — Front-end

[![CI/CD frontend](https://github.com/acadl-dev/finora-frontend/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/acadl-dev/finora-frontend/actions/workflows/ci-cd.yml)

Interface web do Finora (controle financeiro pessoal) em Next.js 16 + React 19 + Tailwind.
Conversa apenas com o **gateway-service** do [backend](https://github.com/acadl-dev/finora-backend),
por meio das rotas `/api/*` do próprio Next (o token JWT fica em cookie httpOnly).

## Desenvolvimento

```bash
npm install
cp .env.example .env.local     # API_BASE_URL=http://localhost:8080 (gateway)
npm run dev                    # http://localhost:3000
```

| Script | Faz |
|---|---|
| `npm run lint` | ESLint |
| `npm run typecheck` | Checagem de tipos (TypeScript) |
| `npm test` | Testes unitários (Vitest) |
| `npm run build` | Build de produção (`output: "standalone"`) |

## Produção (Docker / Kubernetes)

```bash
docker build -t ghcr.io/acadl-dev/finora-frontend:local .
docker run -p 3000:3000 -e API_BASE_URL=http://host.docker.internal:8080 ghcr.io/acadl-dev/finora-frontend:local
```

- `API_BASE_URL` é lido em tempo de execução (a mesma imagem serve para qualquer ambiente).
- Health check: `GET /api/health` → `{"status":"UP"}` (usado pelos probes do Kubernetes).
- No Kubernetes, o front é implantado pelos manifests do backend (`deploy/k8s/frontend`) e
  acessado em http://localhost:3000. Ver `docs/implantacao.md` no repositório do backend.

## CI/CD

`.github/workflows/ci-cd.yml`: a cada push/PR roda lint, tipos, testes e build; na `main` (ou
tag `v*`) publica a imagem `ghcr.io/acadl-dev/finora-frontend` no GitHub Container Registry.
