import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from './graphql/schemasMap';
import { Express } from 'express-serve-static-core';
import cors from 'cors';
import ws from 'ws';
import quizService from './service/quizService';
import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { ClientEvent } from './quiz_types';

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());


export const startup = async (app: Express): Promise<void> => {
  const apolloServer = new ApolloServer({
  schema,
});
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: `/graphql` });
};

startup(app);
const server = app.listen(PORT, () => {
  console.log(`GraphQL is running on http://localhost:${PORT}/graphql`);
  console.log(`WebSocket is running on ws://localhost:${PORT}`);
});


const wsServer = new ws.Server({ server: server });
wsServer.on('connection', (socket: WebSocket, request: IncomingMessage) => {
  console.log("Connected");
  socket.on('message', (data: WebSocket.Data) => {
    handleMessage(socket, request, data);
  });
});

const handleMessage = (socket: WebSocket, request: IncomingMessage, data: WebSocket.Data) => {
    try {
      // TODO data validation
      const quizEvent = JSON.parse(data.toString()) as ClientEvent;
      if (request.socket.remoteAddress) {
        console.log(`Message from user ${request.socket.remoteAddress}`);
      }
      console.log(quizEvent);
      // TODO connection and game engine should not be coupled
      quizService.handleEvent(socket, quizEvent);
    } catch (error) {
      console.log(error);
    }
};
