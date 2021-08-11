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

const PORT = 4000;
const WEBSOCKET_PORT = 4001;

const app = express();
app.use(cors());


export const startup = async (app: Express): Promise<void> => {
  const server = new ApolloServer({
  schema,
});
  await server.start();
  server.applyMiddleware({ app, path: `/graphql` });
};

void startup(app);
app.listen(PORT, () => {
  console.log(`GraphQL is now running on http://localhost:${PORT}/graphql`);
});


// After starting a quiz, remove it from open quizes
const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', (socket: WebSocket, request: IncomingMessage) => {
  console.log("Connected");
  socket.on('message', (data: WebSocket.Data) => {
    handleMessage(socket, request, data);
  });
});

const handleMessage = (socket: WebSocket, request: IncomingMessage, data: WebSocket.Data) => {
    try {
      // TODO data validatoin
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

const server = app.listen(WEBSOCKET_PORT, () => {
  console.log(`WebSocket is now running on ws://localhost:${WEBSOCKET_PORT}`);
});
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});
