FROM node

COPY ./backend .
RUN npm install

CMD [ "sh", "-c", "node ." ]
