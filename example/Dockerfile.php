FROM php:8.1.3-cli-alpine3.15
RUN docker-php-ext-install pcntl
COPY service.php /app/service.php
ENTRYPOINT ["php"]
CMD ["/app/service.php"]
