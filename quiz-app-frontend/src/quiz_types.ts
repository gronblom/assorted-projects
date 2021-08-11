import { Difficulty, Question, QuestionType, QuizParams } from "./graphql/generated";

export type QuizId = string;
export type Username = string;

export enum EventType {
    JOIN_QUIZ = "JOIN_QUIZ",
    LEAVE_QUIZ = "LEAVE_QUIZ",
    QUIZ_PLAYERS = "QUIZ_PLAYERS",
    CANCEL_QUIZ = "CANCEL_QUIZ",
    START_QUIZ = "START_QUIZ",
    QUESTION = "QUESTION",
    QUESTION_ANSWER = "QUESTION_ANSWER",
    QUESTION_RESULTS = "QUESTION_RESULTS",
    QUIZ_FINISHED = "QUIZ_FINISHED",
}

interface EventBase {
    id: QuizId
    event_type: EventType
}

export interface JoinQuizEvent extends EventBase {
    event_type: EventType.JOIN_QUIZ
    username: Username
}

export interface LeaveQuizEvent extends EventBase {
    event_type: EventType.LEAVE_QUIZ;
    username: Username;
}

export interface QuizPlayersEvent extends EventBase {
    event_type: EventType.QUIZ_PLAYERS
    players: Array<Username>
}

export interface CancelQuizEvent extends EventBase {
    event_type: EventType.CANCEL_QUIZ;
    username: Username;
}

export interface StartQuizEvent extends EventBase {
    event_type: EventType.START_QUIZ;
    username: Username;
}

export interface PublicQuestion {
    category: string
    type: QuestionType;
    difficulty: Difficulty;
    question: string;
    alternatives: Array<string>;
}

export interface QuestionEvent extends EventBase {
    event_type: EventType.QUESTION
    question_number: number
    question: PublicQuestion
}

export interface QuestionAnswerEvent extends EventBase {
    event_type: EventType.QUESTION_ANSWER
    username: Username
    question_number: number
    answer: string
}

export interface QuestionResultsAnswer {
    username: Username
    answer: string
    correct_answer: boolean
    total_correct_answers: number
}

export interface QuestionResultsEvent extends EventBase {
    event_type: EventType.QUESTION_RESULTS
    question_number: number
    question: string
    correct_answer: string,
    player_answers: Record<string, QuestionResultsAnswer>
}

export interface QuizFinishedEvent extends EventBase {
    event_type: EventType.QUIZ_FINISHED
}

export interface Player {
    id: string
    username: Username
}

export type ClientEvent = JoinQuizEvent | LeaveQuizEvent | CancelQuizEvent | StartQuizEvent | QuestionAnswerEvent;

export type HostEvent = QuizPlayersEvent | QuestionEvent | QuestionResultsEvent | QuizFinishedEvent;

export enum QuizState {
    OPEN = "OPEN",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED"
}

export interface ActiveQuiz {
    state: QuizState
    params: QuizParams
    players: Array<Username>
    current_question: number | null
    questions: Array<Question>
    answers: Array<{ [key: string]: QuestionResultsAnswer }>
}
