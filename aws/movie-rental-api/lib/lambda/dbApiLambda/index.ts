import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
const { Client } = require('pg');

export const handleApiRequest = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

 const client = new Client({
                   user: process.env.DB_USER,
                   host: process.env.DB_HOST,
                   database: process.env.DB_NAME,
                   password: process.env.DB_PASSWORD,
                   port: process.env.DB_PORT
                 });
  await client.connect();
  const res = await query(client, "select * from actor;")
  client.end()

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'command completed successfully',
      result: res,
      event: event
    }),
  };
};

function query(client: any, sql: string) {
  return new Promise((resolve, reject) => {
    client.query(sql, (error: any, res: unknown) => {
      if (error) return reject(error)

      return resolve(res)
    })
  })
}
