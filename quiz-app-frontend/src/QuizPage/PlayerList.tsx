import { ReactElement } from "react";
import { Icon, Label, List } from "semantic-ui-react";
import { QuestionState, QuizPageState } from "./QuizPage";

interface Props {
    quizState: QuizPageState
}

const PlayerList = ({ quizState }: Props) => {

    const scoreIcon = (state: QuestionState, key: number | string): ReactElement | null => {
        switch (state) {
            case QuestionState.UNANSWERED:
                return (<Icon key={key} name="circle outline" />);
            case QuestionState.CORRECT:
                return (<Icon key={key} name="check" color="green" />);
            case QuestionState.INCORRECT:
                return (<Icon key={key} name="minus circle" color="red" />);
            default:
                return null;
        }
    };
    return (
        <List>
            {quizState.players.map(username => {
                return (
                    <List.Item key={username}>

                        <div>
                            <Label style={{ backgroundColor: ' #7dcea0', marginBottom: '2px' }}>
                                {username}
                            </Label>
                            {!isNaN(quizState.totalCorrectQuestions[username]) &&
                                <Label>
                                    <Icon name="check" color="green" /> {quizState.totalCorrectQuestions[username]}
                                </Label>}
                            {quizState.winners.includes(username) &&
                                <Icon name="winner" color="yellow"/>}
                        </div>
                        <div>{quizState.scores[username] && quizState.scores[username].map((state, questionNumber) => scoreIcon(state, questionNumber))}</div>
                    </List.Item>
                );
            })}
        </List>
    );
};

export default PlayerList;