FROM node:16 as node-build
WORKDIR /app
COPY ./ .
RUN npm install
RUN npm run build
# RUN ./node_modules/@angular/cli/bin/ng build

FROM nginx:latest AS nginx
COPY --from=node-build /app/dist/starter /usr/share/nginx/html
# COPY /nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
