FROM node:alpine
WORKDIR /lm-ui
COPY . .
RUN rm -rf yaml
RUN rm -rf node_modules
RUN rm -rf .husky
RUN yarn install
CMD ["yarn", "start"]