import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
//import AddEntryForm, { EntryFormValues } from './AddEntryForm';
import AddMultiEntryForm, { MultiEntryFormValues} from './AddMultiEntryForm';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: MultiEntryFormValues) => void;
  error?: string;
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>Add a new entry</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <AddMultiEntryForm onSubmit={onSubmit} onCancel={onClose} />
    </Modal.Content>
  </Modal>
);

export default AddEntryModal;