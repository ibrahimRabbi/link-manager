FROM node:alpine
WORKDIR /lm-ui
COPY . .
RUN rm -rf yaml
RUN rm -rf node_modules
RUN rm .env
RUN echo "NODE_ENV=development" >> .env
RUN echo "REACT_APP_CONFIGURATION_AWARE=false" >> .env
RUN echo "WDS_SOCKET_PORT=0" >> .env
RUN yarn install
CMD ["yarn", "start"]