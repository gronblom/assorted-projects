import React from 'react';
import { Item } from 'semantic-ui-react';
import { Diagnosis, Entry } from '../types';
import HealthCheckEntryDetails from './HealthCheckEntryDetails';
import HospitalEntryDetails from './HospitalEntryDetails';
import OccupationalHealthcareEntryDetails from './OccupationalHealthcareEntryDetails';

type EntryDetailsProps = {
  entries: Entry[],
  diagnoses: { [code: string]: Diagnosis }
};

const EntryDetails = ({ entries, diagnoses}: EntryDetailsProps) => {
  
  const EntryItem: React.FC<{ entry: Entry}> = ({entry}) => {
    switch(entry.type) {
      case "Hospital":
        return <HospitalEntryDetails entry={entry} diagnoses={diagnoses} />;
      case "HealthCheck":
        return <HealthCheckEntryDetails entry={entry} diagnoses={diagnoses} />;
      case "OccupationalHealthcare":
        return <OccupationalHealthcareEntryDetails entry={entry} diagnoses={diagnoses} />;
      default:
        throw new Error(`Invalid Entry type: ${JSON.stringify(entry)}`);
    }
  };
  
  return (
   <Item.Group divided>
     {entries.map((entry: Entry) => (
       <EntryItem key={entry.id} entry={entry} />
     )
     )}
   </Item.Group>
  );
};

export default EntryDetails;
