# BCS

Site do banco BCS — **React** (frontend) + **Laravel** (backend/API).

## Stack

| Camada   | Tecnologia                                   |
| -------- | -------------------------------------------- |
| Frontend | React 19 + TypeScript + Vite + Tailwind v4   |
|          | React Router, Axios                          |
| Backend  | Laravel 13 (API) + Sanctum (auth)            |
| PHP      | 8.3 (via Homebrew `php@8.3`)                  |

## Estrutura

```
BCS/
├── backend/    # API Laravel
└── frontend/   # SPA React
```

## Rodando em desenvolvimento

> ⚠️ As portas 8000 e 5173 estão ocupadas pelo Docker nesta máquina.
> Por isso usamos **8001** (backend) e **5174** (frontend).

### Backend (porta 8001)

```bash
cd backend
/usr/local/opt/php@8.3/bin/php artisan serve --port=8001
```

### Frontend (porta 5174)

```bash
cd frontend
npm run dev
```

O Vite faz proxy de `/api` → `http://localhost:8001`.
Acesse: http://localhost:5174

## Endpoints de exemplo

- `GET /api/health` — verificação de status
- `GET /api/user` — usuário autenticado (Sanctum)

## Próximos passos

- [ ] Montar o layout a partir dos screens do Figma
- [ ] Autenticação (login/registro)
- [ ] Telas do internet banking
