FROM node:alpine
WORKDIR /lm-ui
COPY . .
RUN rm -rf yaml
RUN yarn build
CMD ["yarn", "start"]
