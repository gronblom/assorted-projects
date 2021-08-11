import React from 'react';
import { Icon, Item } from 'semantic-ui-react';
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';
import { Diagnosis, HealthCheckEntry, HealthCheckRating } from '../types';
import DiagnosisList from './DiagnosisList';

type HealthCheckProps = {
  entry: HealthCheckEntry,
  diagnoses: { [code: string]: Diagnosis }
};

const HealthCheckEntryDetails = ({ entry, diagnoses }: HealthCheckProps) => {
  
  const RatingIcon: React.FC<{ rating: HealthCheckRating}> = ({ rating }) => {
    let color: SemanticCOLORS;
    switch(rating) {
      case HealthCheckRating.Healthy:
        color="green";
        break;
      case HealthCheckRating.LowRisk:
        color="yellow";
        break;
      case HealthCheckRating.HighRisk:
        color="orange";
        break;
      case HealthCheckRating.CriticalRisk:
        color="red";
        break;
    }
    return <Icon name="heart" color={color} />;
  };

  return (
    <Item>
      <Item.Content>
        <Item.Header><Icon name="heartbeat" />{entry.date}</Item.Header>
        <Item.Description>
          <RatingIcon rating={entry.healthCheckRating} />
          {entry.description}
        </Item.Description>
        <Item.Extra>
          <DiagnosisList diagnosisCodes={entry.diagnosisCodes} diagnoses={diagnoses} />
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

export default HealthCheckEntryDetails;