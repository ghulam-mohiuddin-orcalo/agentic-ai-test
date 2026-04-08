FROM node:22-alpine

# Prisma needs openssl on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

# Copy pre-built dist and node_modules from host
COPY package*.json ./
COPY node_modules ./node_modules
COPY dist ./dist
COPY prisma ./prisma

EXPOSE 5001

CMD ["node", "dist/main"]
