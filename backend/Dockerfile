FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    git curl zip unzip \
    libpng-dev libonig-dev libxml2-dev \
    libzip-dev libicu-dev libmagickwand-dev \
    libssl-dev librabbitmq-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd intl zip \
    && rm -rf /var/lib/apt/lists/*

RUN pecl install amqp \
    && docker-php-ext-enable amqp

# Composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./

RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-scripts

COPY . .

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

CMD ["sh", "-c", "\
chown -R www-data:www-data storage bootstrap/cache || true && \
chmod -R 775 storage bootstrap/cache || true && \
php-fpm \
"]
