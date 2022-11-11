FROM node:16 AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY public ./public/

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:16

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "run", "start:prod"]