import axios from 'axios';
import { Difficulty, Question, QuestionType, QuizParams } from "../graphql/generated";

const API_URL = 'https://opentdb.com/api.php';
const API_TOKEN_URL = 'https://opentdb.com/api_token.php';
const MAX_QUESTIONS_PER_REQUEST = 50;

enum OpenTDBResponseCode {
    SUCCESS = 0,
    NO_RESULTS = 1,
    INVALID_PARAMETER = 2,
    TOKEN_NOT_FOUND = 3,
    TOKEN_EMPTY = 4
}

type OpenTDBResponse = {
    response_code: number
    results: Array<EncodedQuestion>
    token?: string
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

const getCommonRequestParams = async (params: QuizParams): Promise<Record<string, string | number>> => {
    const encode = "base64"
    const commonParams: Record<string, string | number> = { encode }
    if (params.question_amount > MAX_QUESTIONS_PER_REQUEST) {
        // If we need to do multiple requests we can pass a token to prevent duplicate questions
        const { data: response } = await axios.get<OpenTDBResponse>(
            `${API_TOKEN_URL}`, { params: { command: "request" } }
        );
        if (response.response_code === OpenTDBResponseCode.SUCCESS && response.token) {
            commonParams["token"] = response.token;
        } else {
            console.log("Error when fetching token");
            console.log(response);
            throw 'Error when fetching token'
        }
    }
    if (params.difficulty !== Difficulty.Any) {
        commonParams["difficulty"] = params.difficulty.toLowerCase();
    }
    if (params.type !== QuestionType.Any) {
        if (params.type === QuestionType.Boolean) {
            commonParams["type"] = "boolean"
        } else if (params.type === QuestionType.MultipleChoice) {
            commonParams["type"] = "multiple";
        }
    }
    return commonParams;
};

// Calculate how many question separate requests needs to be done for the quiz
const getQuestionAmountPerRequest = (question_amount: number): Array<number> => {
    let questionAmountPerRequest: Array<number> = [];
    const maxQuestionRequestAmount = Math.floor(question_amount / MAX_QUESTIONS_PER_REQUEST);
    if (maxQuestionRequestAmount > 0) {
        questionAmountPerRequest = questionAmountPerRequest.concat(Array(maxQuestionRequestAmount).fill(MAX_QUESTIONS_PER_REQUEST));
    }
    const remainderAmount = question_amount % MAX_QUESTIONS_PER_REQUEST;
    if (remainderAmount > 0) {
        questionAmountPerRequest.push(remainderAmount);
    }
    return questionAmountPerRequest;
}

const getRequestParams = async (params: QuizParams): Promise<Array<Record<string, string | number>>> => {
    const requests: Array<Record<string, string | number>> = []
    const commonParams = await getCommonRequestParams(params);
    if (params.categories && params.categories.length > 0) {
        const questionsPerCategory = Math.ceil(params.question_amount / params.categories.length);
        const questionsPerRequest = getQuestionAmountPerRequest(questionsPerCategory);
        params.categories.forEach(category => {
            questionsPerRequest.forEach(questionAmount => {
                requests.push({ ...commonParams, category, amount: questionAmount })
            })
        });
    } else {
        const questionsPerRequest = getQuestionAmountPerRequest(params.question_amount);
        questionsPerRequest.forEach(questionAmount => {
            requests.push({ ...commonParams, amount: questionAmount })
        });
    }
    return requests;
}

export const fetchQuestions = async (params: QuizParams): Promise<Array<Question>> => {
    const allQuestions: Array<Question> = [];
    const requestsParams = await getRequestParams(params);
    await Promise.all(requestsParams.map(async (reqParams) => {
        console.log("Fetching questions with params:");
        console.log(reqParams);
        const { data: response } = await axios.get<OpenTDBResponse>(
            `${API_URL}`, { params: reqParams }
        );
        if (response.response_code == OpenTDBResponseCode.SUCCESS) {
            console.log(`Received ${response.results.length} questions`);
            for (const question of response.results) {
                const decodedQuestion = decodeBase64Question(question);
                allQuestions.push(decodedQuestion);
            }
        } else {
            console.log("Error when fetching questions");
            console.log(response);
        }
    }));
    if (allQuestions.length == 0) {
        throw "Failed to fetch questions";
    }
    shuffle(allQuestions);
    const superfluousQuestionAmount = allQuestions.length - params.question_amount;
    if (superfluousQuestionAmount > 0) {
        allQuestions.splice(0, superfluousQuestionAmount);
    }
    return allQuestions;

}

/**
 * Shuffles array in place.
 * @param {Array<any>} a items An array containing the items.
 */
function shuffle(arr: Array<any>): Array<any> {
    var j, x, index;
    for (index = arr.length - 1; index > 0; index--) {
        j = Math.floor(Math.random() * (index + 1));
        x = arr[index];
        arr[index] = arr[j];
        arr[j] = x;
    }
    return arr;
}