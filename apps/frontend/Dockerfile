FROM alpine:latest

RUN apk add lighttpd

COPY dist/apps/frontend /var/www/localhost/htdocs

EXPOSE 80

ENTRYPOINT ["lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]