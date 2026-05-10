FROM php:8.2-apache

# Instalar dependencias del sistema y extensiones de PHP
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite3 \
    libsqlite3-dev \
    && docker-php-ext-install pdo_sqlite mbstring exif pcntl bcmath gd

# Habilitar el módulo rewrite de Apache
RUN a2enmod rewrite

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Directorio de trabajo
WORKDIR /var/www/html

# Copiar los archivos del proyecto al contenedor
COPY . /var/www/html

# Dar permisos a las carpetas que Laravel necesita escribir
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Cambiar el DocumentRoot de Apache para que apunte a la carpeta public de Laravel
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!/var/www/html/public!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Crear el archivo SQLite si vamos a usar SQLite
RUN touch /var/www/html/database/database.sqlite
RUN chown www-data:www-data /var/www/html/database/database.sqlite

# Instalar las dependencias de Laravel
RUN composer install --optimize-autoloader --no-dev

# Exponer el puerto 80 (Render lo detectará automáticamente)
EXPOSE 80

# Script de arranque: Ejecutar migraciones y arrancar Apache
CMD php artisan migrate --force && apache2-foreground
