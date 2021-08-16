import { useQuery } from '@apollo/client';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Label, Segment } from 'semantic-ui-react';
import { LoadingIcon } from '../components/LoadingIcon';
import { QuizParams } from '../graphql/generated';
import { getOpenQuizzesResponse, GET_OPEN_QUIZES } from '../graphql/queries';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import * as quiz_types from '../quiz_types';
import QuizQuestion from './QuizQuestion';
import PlayerList from './PlayerList';

interface Props {
    username: string
    endQuiz: () => void
    setQuizActive: (value: boolean) => void
}

export enum QuestionState {
    UNANSWERED,
    CORRECT,
    INCORRECT
}

export interface QuizPageState {
    players: Array<quiz_types.Username>
    quizStarted: boolean
    currentQuestion: quiz_types.QuestionEvent | null
    currentResult: quiz_types.QuestionResultsEvent | null
    scores: { [key: string]: Array<QuestionState> }
    totalCorrectQuestions: { [key: string]: number }
    quizFinished: boolean
    winners: Array<quiz_types.Username>
}

const QuizPage = ({ username, setQuizActive, endQuiz }: Props) => {
    useEffect(() => {
        setQuizActive(true);
    });
    const [quizParams, setQuizParams] = useState<QuizParams | null>(null);
    const [quizState, setQuizState] = useState<QuizPageState>({
        players: [],
        quizStarted: false,
        currentQuestion: null,
        currentResult: null,
        scores: {},
        totalCorrectQuestions: {},
        quizFinished: false,
        winners: []
    });
    const updateQuizState = (updatedState: Record<string, unknown>) => {
        setQuizState(prevState => {
            return { ...prevState, ...updatedState };
        });
    };
    const { id } = useParams<{ id: string }>();
    const { data, loading, error } = useQuery<getOpenQuizzesResponse>(GET_OPEN_QUIZES, { variables: { id: id } });
    useEffect(() => {
        if (data && data.getOpenQuizzes) {
            if (data.getOpenQuizzes.length === 1) {
                setQuizParams(data.getOpenQuizzes[0]);
            } else {
                console.log("Quiz does not exist");
                setTimeout(() => {
                    endQuiz();
                }, 1000);
            }
        }
    }, [data, endQuiz]);

    const [socketUrl] = useState('ws://localhost:4000');
    const messageHistory = useRef<Array<MessageEvent<any> | null>>([]);

    const {
        sendJsonMessage,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        lastJsonMessage,
        readyState,
    } = useWebSocket(socketUrl, {
        onOpen: () => joinQuiz(),
    });

    useEffect(() => {
        if (lastJsonMessage) {
            console.log(lastJsonMessage);
            if (lastJsonMessage.event_type === quiz_types.EventType.QUIZ_PLAYERS.toString()) {
                updateQuizState({ players: lastJsonMessage.players as string[] });
            } else if (lastJsonMessage.event_type === quiz_types.EventType.QUESTION.toString()) {
                if (!quizState.quizStarted) {
                    initQuiz();
                }
                updateQuizState({ currentQuestion: lastJsonMessage as quiz_types.QuestionEvent });
            } else if (lastJsonMessage.event_type === quiz_types.EventType.QUESTION_RESULTS.toString()) {
                handleQuestionResult(lastJsonMessage);
            } else if (lastJsonMessage.event_type === quiz_types.EventType.QUIZ_FINISHED.toString()) {
                const winners = quizState.currentResult ? determineWinners(quizState.currentResult) : [];
                updateQuizState({ currentQuestion: null, quizFinished: true, winners });
            }
        }

    }, [lastJsonMessage]);

    messageHistory.current = useMemo(() => {
        // TODO implement chat
        if (lastJsonMessage) {
            return messageHistory.current.concat(lastJsonMessage);
        } else {
            return messageHistory.current;
        }
    }, [lastJsonMessage]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    const joinQuiz = () => {
        const payload = { event_type: quiz_types.EventType.JOIN_QUIZ, id, username } as quiz_types.JoinQuizEvent;
        sendJsonMessage(payload);
    };

    const cancelQuiz = () => {
        const payload: quiz_types.CancelQuizEvent = { event_type: quiz_types.EventType.CANCEL_QUIZ, id, username };
        sendJsonMessage(payload);
        endQuiz();
    };

    const leaveQuiz = () => {
        const payload: quiz_types.LeaveQuizEvent = { event_type: quiz_types.EventType.LEAVE_QUIZ, id, username };
        sendJsonMessage(payload);
        endQuiz();
    };

    const startQuiz = () => {
        console.log(`Starting quiz, web socket state: ${connectionStatus}`);
        const payload: quiz_types.StartQuizEvent = { event_type: quiz_types.EventType.START_QUIZ, id, username };
        sendJsonMessage(payload);
    };

    const initQuiz = () => {
        const questionAmount = quizParams ? quizParams.question_amount : 0;
        const initialScores = quizState.players.reduce((acc, key) => ({ ...acc, [key]: Array(questionAmount).fill(QuestionState.UNANSWERED) }), {});
        updateQuizState({ quizStarted: true, scores: initialScores });
    };

    const answerQuestion = (question_number: number, answer: string): void => {
        const payload: quiz_types.QuestionAnswerEvent = { event_type: quiz_types.EventType.QUESTION_ANSWER, id, username, question_number, answer };
        sendJsonMessage(payload);
    };

    const handleQuestionResult = (event: quiz_types.QuestionResultsEvent) => {
        setQuizState(prevState => {
            const updatedScores = { ...prevState.scores };
            const updatedTotalCorrectQuestions = { ...prevState.totalCorrectQuestions };
            for (const [username, answer] of Object.entries(event.player_answers)) {
                updatedScores[username][event.question_number] = answer.correct_answer ? QuestionState.CORRECT : QuestionState.INCORRECT;
                updatedTotalCorrectQuestions[username] = answer.total_correct_answers;
            }
            return { ...prevState, currentResult: event, scores: { ...updatedScores }, totalCorrectQuestions: { ...updatedTotalCorrectQuestions } };
        });
    };

    const determineWinners = (event: quiz_types.QuestionResultsEvent) => {
        const maxScore = Math.max(...Object.entries(event.player_answers).map(([_, answer]) => answer.total_correct_answers));
        const winners = Object.entries(event.player_answers).filter(([_, answer]) => answer.total_correct_answers === maxScore).map(([username, _]) => username);
        return winners;
    };

    if (loading) {
        return (<LoadingIcon />);
    } else if (error) {
        console.log(error);
        setTimeout(() => {
            endQuiz();
        }, 10000);
        return (<div>Error fetching data</div>);
    }
    if (!quizParams) {
        // Will redirect to main page from useEffect hook if quiz cannot be found
        return null;
    }

    // TODO jwt authentication
    const playerIsHost = quizParams.created_by === username;

    return (
        <Container>
            <h1>{quizParams.name}</h1>
            {!quizState.quizFinished && quizState.currentQuestion &&
                <Segment>
                    <QuizQuestion questionEvent={quizState.currentQuestion} answerQuestion={answerQuestion} />
                </Segment>}
            <Segment>
                <PlayerList quizState={quizState} />
            </Segment>
            {quizState.currentResult &&
                (<Segment>
                    <div>
                        <div><Label size="medium">Previous question:</Label> {quizState.currentResult.question}</div>
                        <div><Label size="medium">Correct answer:</Label> {quizState.currentResult.correct_answer}</div>
                    </div>
                </Segment>)
            }
            <Segment>
                {/*Connection status: {connectionStatus}*/}
                {!quizState.quizStarted && playerIsHost && <Button onClick={() => startQuiz()} toggle color="blue">Start quiz</Button>}
                {!quizState.quizFinished && playerIsHost && <Button onClick={() => cancelQuiz()} secondary >Cancel</Button>}
                {!quizState.quizFinished && !playerIsHost && <Button onClick={() => leaveQuiz()} secondary>Leave</Button>}
                {quizState.quizFinished && <Button onClick={() => leaveQuiz()}>Return</Button>}
            </Segment>
        </Container>
    );

};

export default QuizPage;
