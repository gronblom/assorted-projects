import { Modal, Segment } from 'semantic-ui-react';
import { MutationCreateQuizArgs } from '../graphql/generated';
import CreateQuizForm from './CreateQuizForm';

interface Props {
  username: string;
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: MutationCreateQuizArgs) => void;
  error?: string;
}

const CreateQuizModal = ({ username, modalOpen, onClose, onSubmit, error }: Props) => (
  <Modal closable="false" open={modalOpen} onClose={onClose} centered={false} closeOnDimmerClick={false} closeIcon>
    <Modal.Header>Create a new quiz</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <CreateQuizForm username={username} onSubmit={onSubmit} onCancel={onClose} />
    </Modal.Content>
  </Modal>
);

export default CreateQuizModal;
