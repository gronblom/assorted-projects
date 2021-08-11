import { IResolvers } from "@graphql-tools/utils";
import { merge } from 'lodash';
import { QuizResolvers } from "./resolvers/quiz";

const resolversMap: IResolvers = merge(QuizResolvers);

export default resolversMap;
