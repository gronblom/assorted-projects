FROM amazon/aws-lambda-nodejs:14
WORKDIR ${LAMBDA_TASK_ROOT}

COPY package.json ./
RUN npm install --only=production
COPY index.js ./
COPY sql/pagila-schema.sql ./
COPY sql/pagila-data.sql ./
COPY sql/pagila-insert-data.sql ./

CMD [ "index.handler" ]
