import { useEffect, useState } from "react";
import { Button, Header, List } from "semantic-ui-react";
import { QuestionEvent } from "../quiz_types";

interface Props {
    questionEvent: QuestionEvent
    answerQuestion: (question_number: number, answer: string) => void
}

const QuizQuestion = ({ questionEvent, answerQuestion }: Props) => {
    useEffect(() => {
        setSelectedAnswer(null);
    }, [questionEvent]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const selectAnswer = (alternative: string) => {
        setSelectedAnswer(alternative);
        answerQuestion(questionEvent.question_number, alternative);
    };

    return (
        <div>
            <Header as="h3"><div>{questionEvent.question.question}</div></Header>
            <List divided selection>
                {questionEvent.question.alternatives.map(alternative => {
                    return (
                        <List.Item key={alternative}>
                            <Button onClick={() => selectAnswer(alternative)} disabled={selectedAnswer !== null} toggle color='purple' active={alternative === selectedAnswer}>
                                Select
                            </Button>
                            {alternative}

                        </List.Item>);
                })}
            </List>
        </div>
    );
};

export default QuizQuestion;