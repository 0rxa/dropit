FROM node

COPY . .
RUN npm install

CMD [ "sh", "-c", "npm run $EXECENV" ]
