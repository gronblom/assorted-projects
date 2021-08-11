import React from 'react';
import { Icon, Item } from 'semantic-ui-react';
import { Diagnosis, OccupationalHealthcareEntry } from '../types';
import DiagnosisList from './DiagnosisList';

type OccupationalHealthcareProps = {
  entry: OccupationalHealthcareEntry,
  diagnoses: { [code: string]: Diagnosis }
};

const OccupationalHealthcareEntryDetails = ({ entry, diagnoses }: OccupationalHealthcareProps) => {
  return (
    <Item>
      <Item.Content>
        <Item.Header><Icon name="stethoscope" />{entry.date}</Item.Header>
        <Item.Description>
          <div>{entry.description}</div>
          <div>Employer name: {entry.employerName}</div>
          {entry.sickLeave && <div>Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate} </div>}
        </Item.Description>
        <Item.Extra>
          <DiagnosisList diagnosisCodes={entry.diagnosisCodes} diagnoses={diagnoses} />
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

export default OccupationalHealthcareEntryDetails;