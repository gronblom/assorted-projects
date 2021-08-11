import React, { useEffect } from 'react';
import { Link, Route, Switch, useHistory } from 'react-router-dom';
import { Button, Container, Divider, Header } from 'semantic-ui-react';
import CreateQuizModal from './CreateQuizModal';
import { MutationCreateQuizArgs } from './graphql/generated';
import { useMutation } from '@apollo/client';
import SettingsPage from './SettingsPage/SettingsPage';
import QuizPage from './QuizPage/QuizPage';
import { CREATE_QUIZ, CreateQuizResponse } from './graphql/queries';
import { LoadingIcon } from './components/LoadingIcon';
import OpenQuizesPage from './OpenQuizesPage/OpenQuizesPage';


function App() {
  const history = useHistory();
  // TODO react context + localStorage
  const [username, setUsername] = React.useState<string>("");
  useEffect(() => {
    setUsername(`user${Math.floor(Math.random() * 1000000000)}`);
  }, []);
  const [quizActive, setQuizActive] = React.useState<boolean>(false);

  const startQuiz = (data: CreateQuizResponse) => {
    console.log('Received createQuiz response:');
    console.log(data);
    history.push(`/quiz/${data.createQuiz.id}`);
    setQuizActive(true);
  };
  const [createQuiz, { loading: createQuizLoading }] = useMutation(CREATE_QUIZ, { onCompleted: startQuiz });

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const initQuiz = async (values: MutationCreateQuizArgs) => {
    console.log("Creating quiz:");
    console.log(values);
    await createQuiz({ variables: values });
    closeModal();
  };

  const endQuiz = () => {
    console.log("end quiz");
    setQuizActive(false);
    history.push('/');
  };

  return (
    <div className="App">
      <Container>
        {!quizActive &&
          <div>
            <Header as="h1">Quizmeister 3000</Header>
            <div>Username: {username}</div>
            <Button as={Link} to="/" primary>
              Quizes
            </Button>
            <Button as={Link} to="/settings" primary>
              Settings
            </Button>
            <CreateQuizModal username={username} modalOpen={modalOpen} onSubmit={initQuiz} onClose={closeModal} error={error} />
            <Button onClick={() => openModal()} color="green">Create new quiz</Button>
          </div>
        }
        <Divider hidden />
        <Switch>
          <Route path="/settings">
            <SettingsPage username={username} setUsername={setUsername}></SettingsPage>
          </Route>
          <Route path="/quiz/:id">
            <QuizPage username={username} setQuizActive={setQuizActive} endQuiz={endQuiz} />
          </Route>
          <Route path="/">
            {createQuizLoading ? <LoadingIcon /> : <OpenQuizesPage/>}
          </Route>
        </Switch>
      </Container>
    </div>
  );
}

export default App;
