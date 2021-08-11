/* eslint-disable  @typescript-eslint/no-unused-vars */
import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { Diagnosis, Entry, Gender, Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { addEntry, selectPatient, useStateValue } from "../state";

import { Button, Header, Icon, SemanticICONS } from 'semantic-ui-react';
import EntryDetails from "../components/EntryDetails";
import AddEntryModal from "../AddEntry";
//import { EntryFormValues } from "../AddEntry/AddEntryForm";
import { MultiEntryFormValues } from "../AddEntry/AddMultiEntryForm";

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();

  const [{ diagnoses, selectedPatient }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(selectPatient(patientFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    if (!selectedPatient || selectedPatient.id !== id) {
      void fetchPatient();
    }
  }, [id]);

  if (!selectedPatient) {
    return null;
  }

  let iconName: SemanticICONS;
  if (selectedPatient.gender === Gender.Female) {
    iconName = "venus";
  } else if (selectedPatient.gender === Gender.Male) {
    iconName = "mars";
  } else {
    iconName = "genderless";
  }

  const submitNewEntry = async (values: MultiEntryFormValues) => {
    console.log("Submitting new entry:");
    console.log(values);
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${selectedPatient.id}/entries`,
        values
      );
      dispatch(addEntry(selectedPatient.id, newEntry));
      closeModal();
    } catch (e) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };

  return (
    <div className="App">
      <Header>{selectedPatient.name} <Icon name={iconName} /></Header>
      <div>ssn: {selectedPatient.ssn}</div>
      <div>occupation: {selectedPatient.occupation}</div>
      <AddEntryModal modalOpen={modalOpen} onSubmit={submitNewEntry} onClose={closeModal} error={error}/>
      <Button onClick={() => openModal()}>Add New Entry</Button>
      <Header size="medium">Entries</Header>
      <EntryDetails entries={selectedPatient.entries} diagnoses={diagnoses} />
    </div>
  );
};

export default PatientPage;
