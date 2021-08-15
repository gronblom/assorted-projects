import {
    Category, Difficulty, MutationCreateQuizArgs, QueryGetOpenQuizzesArgs, QuestionType,
    QuizParams
} from "../graphql/generated"
import categoryData from './categories';
import { v4 as uuidv4 } from 'uuid';
import {
    ActiveQuiz, ClientEvent, EventType, JoinQuizEvent, LeaveQuizEvent, PublicQuestion, QuestionAnswerEvent,
    QuestionEvent, QuestionResultsEvent, QuizFinishedEvent, QuizId, QuizPlayersEvent, QuizState, Username
} from "../quiz_types";
import WebSocket from "ws";
import { fetchQuestions } from "./opentdbService";

const categories: Array<Category> = categoryData;

const DEFAULT_QUESTION_AMOUNT = 10;

const quizzes: { [key: string]: ActiveQuiz } = {};
const connections: { [key: string]: { [key: string]: WebSocket } } = {};

const getCategories = (): Array<Category> => {
    return categories;
};

const createQuiz = (args: MutationCreateQuizArgs): QuizParams => {
    const id = uuidv4();
    const name = args.name;
    const created_by = args.created_by;
    const created_ts = (new Date()).toISOString();
    const question_amount = args.question_amount ? args.question_amount : DEFAULT_QUESTION_AMOUNT;
    const difficulty = args.difficulty ? args.difficulty : Difficulty.Any;
    const type = args.type ? args.type : QuestionType.Any;
    const categories = args.categories ? args.categories : [];
    const quiz: QuizParams = {
        id,
        name,
        created_by,
        created_ts,
        question_amount,
        difficulty,
        type,
        categories
    };
    const answers = Array(question_amount).fill(null).map(_ => ({}));
    const activeQuiz: ActiveQuiz = {
        state: QuizState.OPEN,
        params: quiz,
        questions: [],
        current_question: null,
        players: [],
        answers
    };
    quizzes[id] = activeQuiz;
    connections[id] = {};
    return quiz;
};

const getOpenQuizzes = (args: QueryGetOpenQuizzesArgs): Array<QuizParams> => {
    if (args.id) {
        return hasKey(quizzes, args.id) ? [quizzes[args.id].params] : [];
    }
    return Object.values(quizzes).filter(quiz => quiz.state === QuizState.OPEN).map(quiz => quiz.params);
};

const endQuiz = (id: string): void => {
    const responseEvent: QuizFinishedEvent = { event_type: EventType.QUIZ_FINISHED, id };
    sendToAllPlayers(id, responseEvent);
    delete quizzes[id];
    if (hasKey(connections, id)) {
        Object.values(connections[id]).forEach(socket => socket.close());
        delete connections[id];
    }
};

const addPlayer = (id: QuizId, username: string) => {
    if (hasKey(quizzes, id) && !quizzes[id].players.includes(username)) {
        quizzes[id].players = quizzes[id].players.concat(username);
    }
};

const removePlayer = (id: QuizId, username: string) => {
    if (hasKey(quizzes, id)) {
        quizzes[id].players = quizzes[id].players.filter(otherUsername => otherUsername !== username);
    }
};

// TODO validate data
const handleEvent = (socket: WebSocket, event: ClientEvent): void => {
    switch (event.event_type) {
        case EventType.JOIN_QUIZ: {
            handleJoinQuiz(socket, event);
            break;
        }
        case EventType.LEAVE_QUIZ: {
            handleLeaveQuiz(socket, event);
            break;
        }
        case EventType.CANCEL_QUIZ: {
            endQuiz(event.id);
            break;
        }
        case EventType.START_QUIZ: {
            startQuiz(event.id, event.username);
            break;
        }
        case EventType.QUESTION_ANSWER: {
            handleQuestionAnswer(event);
            break;
        }
        default: {
            console.log('Invalid event_type:');
            console.log(event);
            socket.send(JSON.stringify({ "error": 'Invalid event_type' }));
            socket.close();
        }
    }
};

const sendQuizPlayersEvent = (id: QuizId) => {
    if (hasKey(quizzes, id) && hasKey(connections, id)) {
        const responseEvent = { event_type: EventType.QUIZ_PLAYERS, players: quizzes[id].players } as QuizPlayersEvent
        Object.values(connections[id]).forEach(socket => socket.send(JSON.stringify(responseEvent)));
    }
};

const addConnection = (socket: WebSocket, id: QuizId, username: Username): void => {
    if (hasKey(connections, id)) {
        if (!hasKey(connections[id], username)) {
            connections[id][username] = socket;
        }
    }
};

const removeConnection = (socket: WebSocket, id: QuizId, username: Username): void => {
    if (hasKey(connections, id)) {
        if (hasKey(connections[id], username)) {
            delete connections[id][username];
            socket.close();
        }
    }
};

const handleJoinQuiz = (socket: WebSocket, event: JoinQuizEvent): void => {
    addConnection(socket, event.id, event.username);
    addPlayer(event.id, event.username);
    sendQuizPlayersEvent(event.id);
};

const handleLeaveQuiz = (socket: WebSocket, event: LeaveQuizEvent): void => {
    removeConnection(socket, event.id, event.username);
    removePlayer(event.id, event.username);
    sendQuizPlayersEvent(event.id);
};

const startQuiz = async (id: QuizId, username: Username): Promise<void> => {
    if (hasKey(quizzes, id) && quizzes[id].params.created_by === username) {
        const quiz = quizzes[id]
        quiz.state = QuizState.ACTIVE;
        try {
            quiz.questions = await fetchQuestions(quiz.params);
            const actualQuestionAmount = quiz.questions.length;
            // Possibly there are less questions available than requested. This is currently not updated client-side.
            if (actualQuestionAmount > quiz.params.question_amount) {
                console.log(`Available questions ${actualQuestionAmount} less than requested ${quiz.params.question_amount}`);
                quiz.params.question_amount = actualQuestionAmount;
            }
            sendNextQuestionOrFinish(id)
        } catch (error) {
            console.log("Error when fetching questions");
            console.log(error);
            endQuiz(id);   
        }
    }
};

const shouldUpdateAnswer = (quiz: ActiveQuiz, questionNumber: number, username: Username): boolean => {
    return questionNumber >= 0 && questionNumber < quiz.params.question_amount &&
        !hasKey(quiz.answers[questionNumber], username) && quiz.players.includes(username)
}

const updateAnswer = (quiz: ActiveQuiz, event: QuestionAnswerEvent) => {
    const correctAnswer = quiz.questions[event.question_number].correct_answer === event.answer;
    let correctAnswers = correctAnswer ? 1 : 0;
    let prevTotalCorrectAnswers = 0;
    if (event.question_number > 0 && quiz.answers[event.question_number - 1][event.username]) {
        prevTotalCorrectAnswers = quiz.answers[(event.question_number - 1)][event.username].total_correct_answers;
    }
    quiz.answers[event.question_number][event.username] = {
        username: event.username,
        answer: event.answer,
        correct_answer: correctAnswer,
        total_correct_answers: prevTotalCorrectAnswers + correctAnswers
    };
};

const allAnswersReceived = (quiz: ActiveQuiz, question_number: number): boolean => {
    return Object.keys(quiz.answers[question_number]).length === quiz.players.length ||
        quiz.questions.length <= question_number;
};

const handleQuestionAnswer = (event: QuestionAnswerEvent) => {
    if (hasKey(quizzes, event.id)) {
        const quiz = quizzes[event.id];
        if (shouldUpdateAnswer(quiz, event.question_number, event.username)) {
            updateAnswer(quiz, event);
        };
        if (allAnswersReceived(quiz, event.question_number)) {
            sendQuestionResults(event, quiz);
            setTimeout(() => {
                sendNextQuestionOrFinish(event.id)
            }, 2000);
        }
    }
};

const sendQuestionResults = (event: QuestionAnswerEvent, quiz: ActiveQuiz) => {
    const responseEvent: QuestionResultsEvent = {
        id: event.id,
        event_type: EventType.QUESTION_RESULTS,
        question_number: event.question_number,
        question: quiz.questions[event.question_number].question,
        correct_answer: quiz.questions[event.question_number].correct_answer,
        player_answers: quiz.answers[event.question_number]
    };
    sendToAllPlayers(event.id, responseEvent);
}

const sendToAllPlayers = (id: QuizId, event: Record<string, any>) => {
    if (hasKey(connections, event.id)) {
        Object.values(connections[id]).forEach(socket => socket.send(JSON.stringify(event)));
    }
}

const finishQuiz = (id: QuizId) => {
    if (hasKey(quizzes, id)) {
        endQuiz(id);
    }
};

const sendNextQuestionOrFinish = (id: QuizId): void => {
    if (hasKey(quizzes, id)) {
        const quiz = quizzes[id];
        if (quiz.current_question === null || quiz.current_question < quiz.questions.length - 1) {
            quiz.current_question = quiz.current_question !== null ? quiz.current_question + 1 : 0;
            const nextQuestion = quiz.questions[quiz.current_question];
            const alternatives = nextQuestion.incorrect_answers.concat(nextQuestion.correct_answer);
            alternatives.sort();
            const publicQuestion: PublicQuestion = {
                category: nextQuestion.category,
                type: nextQuestion.type,
                difficulty: nextQuestion.difficulty,
                question: nextQuestion.question,
                alternatives
            }
            const responseEvent: QuestionEvent = {
                id,
                event_type: EventType.QUESTION,
                question_number: quiz.current_question,
                question: publicQuestion
            };
            sendToAllPlayers(id, responseEvent);
        } else if (quiz.current_question === quiz.questions.length - 1) {
            finishQuiz(id);
        }

    }
}

const hasKey = (obj: Record<string, unknown>, key: string): boolean => {
    return Object.prototype.hasOwnProperty.call(obj, key);
};

export default {
    getCategories,
    getOpenQuizzes,
    createQuiz,
    handleEvent
};
