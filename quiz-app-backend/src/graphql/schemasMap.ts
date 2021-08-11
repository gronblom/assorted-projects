import 'graphql-import-node';

import * as quizTypeDefs from './schemas/quiz.graphql';
import * as emptyTypeDefs from './schemas/empty.graphql';

import { makeExecutableSchema } from '@graphql-tools/schema'

import resolvers from './resolversMap'
import { GraphQLSchema } from 'graphql';

const schema: GraphQLSchema = makeExecutableSchema({
  // A tutorial said to use emptyTypeDefs from which other schemas will extend.
  typeDefs: [emptyTypeDefs, quizTypeDefs],
  resolvers
});

export default schema;