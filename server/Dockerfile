FROM node:current-alpine

# Set the locale
RUN apk add --no-cache unzip wget
RUN wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.34-r0/glibc-2.34-r0.apk && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.34-r0/glibc-bin-2.34-r0.apk && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.34-r0/glibc-i18n-2.34-r0.apk && \
    apk add glibc-2.34-r0.apk glibc-bin-2.34-r0.apk glibc-i18n-2.34-r0.apk && \
    rm /glibc-2.34-r0.apk /glibc-bin-2.34-r0.apk /glibc-i18n-2.34-r0.apk && \
    /usr/glibc-compat/bin/localedef -i ru_RU -f UTF-8 ru_RU.UTF-8
ENV LANG=ru_RU.UTF-8
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]
