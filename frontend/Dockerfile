FROM nginx:alpine
## Copy our default nginx config
COPY default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## Copy over the artifacts in dist folder to default nginx public folder
COPY ./dist/frontend /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
