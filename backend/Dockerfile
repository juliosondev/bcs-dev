# Imagem base do Laravel (BCS backend)
FROM php:8.3-cli-bookworm

# Dependências do sistema + extensões PHP necessárias ao Laravel
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev \
    && docker-php-ext-install pdo_mysql mbstring bcmath zip gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# O código é montado via volume no docker-compose (dev).
# O entrypoint garante dependências, chave e migrations antes de servir.
EXPOSE 8000

CMD ["sh", "-c", "\
  composer install --no-interaction --prefer-dist && \
  php artisan key:generate --force && \
  php artisan migrate --force && \
  php artisan serve --host=0.0.0.0 --port=8000 \
"]
