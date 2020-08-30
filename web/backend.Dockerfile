FROM node

WORKDIR /usr/src/app

COPY ./backend .
RUN npm install

CMD [ "npm", "run", "serve:production" ]
