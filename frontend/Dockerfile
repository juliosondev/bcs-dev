# Imagem base do frontend (BCS — React + Vite)
FROM node:22-bookworm-slim

WORKDIR /app

# O código é montado via volume no docker-compose (dev).
# As dependências são instaladas no arranque (node_modules fica em volume próprio).
EXPOSE 5174

CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0 --port 5174"]
