import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Button, Item } from 'semantic-ui-react';
import { LoadingIcon } from '../components/LoadingIcon';
import { getOpenQuizzesResponse, GET_OPEN_QUIZES } from '../graphql/queries';

const OpenQuizesPage = () => {
    const { loading, data } = useQuery<getOpenQuizzesResponse>(GET_OPEN_QUIZES, { pollInterval: 5000 });
    if (loading) {
        return (<LoadingIcon />);
    } else if (!data) {
        return (<div>Error when fetching open quizes</div>);
    }

    const toLocalTs = (ts: string) => {
        return new Date(ts).toLocaleTimeString('fi-FI');
    };

    return (
        <div>
            <Item.Group>
                {data.getOpenQuizzes.map(quiz => (
                    <Item key={quiz.id}>
                        <Item.Content>
                            <Item.Header as='a'>{quiz.name}</Item.Header>
                            <Item.Meta>{quiz.question_amount} questions</Item.Meta>
                            <Item.Description>
                                <div>creator: {quiz.created_by}</div>
                                <div>created: {toLocalTs(quiz.created_ts)}</div>
                                {/* TODO add player amount to graphql */}
                            </Item.Description>
                            <Item.Extra><Button as={Link} to={`/quiz/${quiz.id}`} size="tiny" color="pink">Join</Button></Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </div>
    );
};

export default OpenQuizesPage;
