import axios from 'axios';
import { Difficulty, Question, QuestionType, QuizParams } from "../graphql/generated";

const URL = 'https://opentdb.com/api.php';
const MAX_QUESTIONS_PER_REQUEST = 50;

type OpenTDBResponse = {
    results: Array<EncodedQuestion>
}

export type EncodedQuestion = {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: Array<string>;
}

const decodeBase64 = (data: string): string => {
    return Buffer.from(data, "base64").toString();
}

const decodeBase64Question = (encodedQuestion: EncodedQuestion): Question => {
    return {
        category: decodeBase64(encodedQuestion.category),
        type: decodeBase64(encodedQuestion.type) as QuestionType,
        difficulty: decodeBase64(encodedQuestion.difficulty) as Difficulty,
        question: decodeBase64(encodedQuestion.question),
        correct_answer: decodeBase64(encodedQuestion.correct_answer),
        incorrect_answers: encodedQuestion.incorrect_answers.map(answer => decodeBase64(answer))
    }
}

// TODO does not handle params yet
export const fetchQuestions = async (params: QuizParams): Promise<Array<Question>> => {
    let fetchedQuestionsAmount = 0;
    const allQuestions: Array<Question> = [];
    const encode = "base64"
    //const token = params.id; // can be used to prevent getting duplicate questions
    while (fetchedQuestionsAmount < params.question_amount) {
        const amount = Math.min(params.question_amount, MAX_QUESTIONS_PER_REQUEST);
        const { data: fetchedQuestions } = await axios.get<OpenTDBResponse>(
            `${URL}`, { params: { amount, encode } }
        );
        fetchedQuestionsAmount += amount;
        for (const question of fetchedQuestions.results) {
            const decodedQuestion = decodeBase64Question(question);
            allQuestions.push(decodedQuestion);
        }
    }
    return allQuestions;



}