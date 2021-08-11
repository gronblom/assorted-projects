import { EventType } from "../quiz_types";

const joinQuizJson = (id: string): string => {
    return JSON.stringify({
        event: EventType.JOIN_QUIZ,
        id,
    });
};

const startQuizJson = (id: string, username: string): string => {
    return JSON.stringify({
        event: EventType.START_QUIZ,
        id,
        username
    });
};

const answerQuestionJson = (id: string, question_num: number, answer: string): string => {
    return JSON.stringify({
        id,
        question_num,
        answer
    });
};

export default {
    joinQuizJson,
    startQuizJson,
    answerQuestionJson
};
