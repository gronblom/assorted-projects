import { IResolvers } from '@graphql-tools/utils';
import quizService from '../../service/quizService';

import { MutationCreateQuizArgs, GetCategoriesResponse, QuizParams, QueryGetOpenQuizzesArgs } from '../generated';

export const QuizResolvers: IResolvers = {
    Query: {
        getCategories(_: void): GetCategoriesResponse {
            const categories = quizService.getCategories();
            return {
                categories
            };
        },
        getOpenQuizzes(_: void, args: QueryGetOpenQuizzesArgs): Array<QuizParams> {
            return quizService.getOpenQuizzes(args);
        }
    },
    Mutation: {
        createQuiz(_: void, args: MutationCreateQuizArgs): QuizParams {
            return quizService.createQuiz(args);
        }
    }
};
