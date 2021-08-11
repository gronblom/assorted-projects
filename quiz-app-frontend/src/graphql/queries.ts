import { gql } from '@apollo/client';
import {
  GetCategoriesResponse as GeneratedGetCategoriesResponse,
  QuizParams
} from './generated';

// Have to add Response types as field for them to work
export type GetCategoriesResponse = {
  getCategories: GeneratedGetCategoriesResponse
};

export type CreateQuizResponse = {
  createQuiz: QuizParams
};

export type getOpenQuizzesResponse = {
  getOpenQuizzes: Array<QuizParams>
};

export const GET_CATEGORIES = gql`
query {
  getCategories {
    categories {
      name
      id
    }
  }
}
`;

export const GET_OPEN_QUIZES = gql`
query GetOpenQuizzes($id: String) {
  getOpenQuizzes(id: $id) {
    id
    name
    created_by,
    created_ts,
    question_amount
    difficulty
    type
  }
}
`;

export const CREATE_QUIZ = gql`
  mutation CreateQuiz($name: String!, $created_by: String!, $question_amount: Int, $type: QuestionType, $difficulty: Difficulty, $categories: [Int!]) {
    createQuiz(name: $name, created_by: $created_by, question_amount: $question_amount, type: $type, difficulty: $difficulty, categories: $categories) {
      id
      name
      question_amount
      difficulty
      type
    }
  }
`;


