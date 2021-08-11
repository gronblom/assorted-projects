import React from 'react';
import { Icon, Item } from 'semantic-ui-react';
import { Diagnosis, HospitalEntry } from '../types';
import DiagnosisList from './DiagnosisList';

type PatientEntryProps = {
  entry: HospitalEntry,
  diagnoses: { [code: string]: Diagnosis }
};

const HospitalEntryDetails = ({ entry, diagnoses }: PatientEntryProps) => {
  return (
    <Item>
      <Item.Content>
        <Item.Header><Icon name="hospital outline" />{entry.date}</Item.Header>
        <Item.Description>
          <div>{entry.description}</div>
          <div>Discharge  date: {entry.discharge.date}</div>
          <div> Criteria: {entry.discharge.criteria}</div>
        </Item.Description>
        <Item.Extra>
          <DiagnosisList diagnosisCodes={entry.diagnosisCodes} diagnoses={diagnoses} />
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

export default HospitalEntryDetails;